using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System;
using System.Data;
using System.Net.Mail;
using System.Net;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public AdminController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }
        [HttpGet("users-by-month")]
        public async Task<IActionResult> GetUsersByMonth()
        {
            const string query = @"SELECT YEAR(CreatedAt) AS Year,MONTH(CreatedAt) AS Month, COUNT(*) AS UserCount FROM Users
                                WHERE RoleId = 4
                                GROUP BY YEAR(CreatedAt), MONTH(CreatedAt)
                                ORDER BY Year, Month";

            try
            {
                var dataTable = await _dbHelper.ExecuteQueryAsync(query);
                var userCountsByMonth = dataTable.AsEnumerable().Select(row => new
                {
                    Year = row.Field<int>("Year"),
                    Month = row.Field<int>("Month"),
                    UserCount = row.Field<long>("UserCount")
                }).ToList();

                return Ok(userCountsByMonth);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a felhasználók lekérdezése közben.", details = ex.Message });
            }
        }

        [HttpGet("total-organizations-and-users")]
        public async Task<IActionResult> GetTotalOrganizationsAndUsers()
        {
            const string query = @"SELECT (SELECT COUNT(*) FROM Organizations) AS TotalOrganizations, 
                                (SELECT COUNT(*) FROM Users WHERE RoleId = 4) AS TotalUsers";

            try
            {
                var result = await _dbHelper.ExecuteQueryAsync(query);
                var data = result.AsEnumerable().Select(row => new
                {
                    TotalOrganizations = row.Field<long>("TotalOrganizations"),
                    TotalUsers = row.Field<long>("TotalUsers")
                }).FirstOrDefault();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a szervezetek és felhasználók lekérdezése közben.", details = ex.Message });
            }
        }

        [HttpGet("organizations")]
        public async Task<IActionResult> GetOrganizations()
        {
            const string query = "SELECT Id, Name, Address, ContactEmail, ContactPhone, CreatedAt FROM Organizations";

            try
            {
                var dataTable = await _dbHelper.ExecuteQueryAsync(query);
                var organizations = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    Name = row.Field<string>("Name"),
                    Address = row.Field<string>("Address"),
                    ContactEmail = row.Field<string>("ContactEmail"),
                    ContactPhone = row.Field<string>("ContactPhone"),
                    CreatedAt = row.Field<DateTime>("CreatedAt").ToString("yyyy-MM-dd")
                }).ToList();

                return Ok(organizations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba az adatok betöltése során!", details = ex.Message });
            }
        }
        [HttpPut("organization/{organizationId}/password")]
        public async Task<IActionResult> ChangeOrganizationPassword(int organizationId, [FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(new { message = "A jelszó nem lehet üres!" });
            }

            try
            {
                const string query = "SELECT Id FROM Users WHERE Id = @OrganizationId";
                var parameters = new[] { new MySqlParameter("@OrganizationId", organizationId) };
                var result = await _dbHelper.ExecuteQueryAsync(query, parameters);

                if (result.Rows.Count == 0)
                {
                    return NotFound(new { message = "Szervezet nem található!" });
                }

                var userId = Convert.ToInt32(result.Rows[0]["Id"]);

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                const string updatePasswordQuery = "UPDATE Users SET PasswordHash = @PasswordHash WHERE Id = @UserId";
                var updateParameters = new[]
                {
                    new MySqlParameter("@PasswordHash", hashedPassword),
                    new MySqlParameter("@UserId", userId)
                };

                await _dbHelper.ExecuteNonQueryAsync(updatePasswordQuery, updateParameters);

                return Ok(new { message = "Jelszó sikeresen módosítva!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a jelszó módosítása közben.", details = ex.Message });
            }
        }

        [HttpPost("new-organization")]
        public async Task<IActionResult> CreateNewOrganization([FromBody] NewOrganizationRequest request)
        {
            if (string.IsNullOrEmpty(request.OrgName) || string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.PhoneNumber) || string.IsNullOrEmpty(request.Address))
            {
                return BadRequest(new { message = "Minden mező kitöltése szükséges!" });
            }

            var plainPassword = GenerateRandomPassword();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);

            const string insertUserQuery = @"INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId) VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId)";
            var userParameters = new MySqlParameter[]
            {
                new MySqlParameter("@FirstName", "Organization"),
                new MySqlParameter("@LastName", request.OrgName),
                new MySqlParameter("@Email", request.Email),
                new MySqlParameter("@PasswordHash", hashedPassword),
                new MySqlParameter("@RoleId", 2)
            };

            try
            {
                await _dbHelper.ExecuteNonQueryAsync(insertUserQuery, userParameters);

                const string getUserIdQuery = "SELECT Id FROM Users WHERE Email = @Email";
                var userIdResult = await _dbHelper.ExecuteQueryAsync(getUserIdQuery, new[] { new MySqlParameter("@Email", request.Email) });
                if (userIdResult.Rows.Count == 0)
                    return StatusCode(500, new { message = "Felhasználó azonosító nem található!" });

                var userId = Convert.ToInt32(userIdResult.Rows[0]["Id"]);

                const string insertOrganizationQuery = @"INSERT INTO Organizations (Id, Name, Address, ContactEmail, ContactPhone) VALUES (@UserId, @OrgName, @Address, @ContactEmail, @ContactPhone)";
                var orgParameters = new MySqlParameter[]
                {
                    new MySqlParameter("@UserId", userId),
                    new MySqlParameter("@OrgName", request.OrgName),
                    new MySqlParameter("@Address", request.Address),
                    new MySqlParameter("@ContactEmail", request.Email),
                    new MySqlParameter("@ContactPhone", request.PhoneNumber)
                };

                await _dbHelper.ExecuteNonQueryAsync(insertOrganizationQuery, orgParameters);

                const string updateUserQuery = "UPDATE Users SET OrganizationId = @UserId WHERE Id = @UserId";
                await _dbHelper.ExecuteNonQueryAsync(updateUserQuery, new[] { new MySqlParameter("@UserId", userId) });

                SendEmail(request.Email, plainPassword, request.OrgName);

                Console.WriteLine($"New Organization Created: {request.OrgName}");
                Console.WriteLine($"Admin Login Email: {request.Email}");
                Console.WriteLine($"Admin Login Password: {plainPassword}");

                return Ok(new { message = "Szövetkezet sikeresen létrehozva!" });
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return Conflict(new { message = "Ez az email cím már foglalt!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba lépett fel a szövetkezet létrehozása közben!", details = ex.Message });
            }
        }

        [HttpPut("organization/{organizationId}")]
        public async Task<IActionResult> UpdateOrganizationDetails(int organizationId, [FromBody] UpdateOrganizationRequest request)
        {
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Address) ||
                string.IsNullOrEmpty(request.ContactEmail) || string.IsNullOrEmpty(request.ContactPhone))
            {
                return BadRequest(new { message = "Minden mező kitöltése szükséges!" });
            }

            try
            {
                const string selectQuery = "SELECT Id FROM Organizations WHERE Id = @OrganizationId";
                var parameters = new[] { new MySqlParameter("@OrganizationId", organizationId) };
                var result = await _dbHelper.ExecuteQueryAsync(selectQuery, parameters);

                if (result.Rows.Count == 0)
                {
                    return NotFound(new { message = "Szervezet nem található!" });
                }
                const string updateQuery = @"UPDATE Organizations
                                             SET Name = @Name, Address = @Address, ContactEmail = @ContactEmail, ContactPhone = @ContactPhone
                                             WHERE Id = @OrganizationId";

                var updateParameters = new[]
                {
                    new MySqlParameter("@Name", request.Name),
                    new MySqlParameter("@Address", request.Address),
                    new MySqlParameter("@ContactEmail", request.ContactEmail),
                    new MySqlParameter("@ContactPhone", request.ContactPhone),
                    new MySqlParameter("@OrganizationId", organizationId)
                };

                await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParameters);

                return Ok(new { message = "Szervezet adatai sikeresen frissítve!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a szervezet adatainak frissítése közben!", details = ex.Message });
            }
        }

        private static string GenerateRandomPassword(int length = 10)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var password = new char[length];
            for (var i = 0; i < length; i++)
            {
                password[i] = chars[random.Next(chars.Length)];
            }
            return new string(password);
        }
        private void SendEmail(string toEmail, string plainPassword, string name)
        {
            try
            {
                using (var client = new SmtpClient())
                {
                    client.Host = "smtp.gmail.com";
                    client.Port = 587;
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.UseDefaultCredentials = false;
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential("info.studenthive@gmail.com", "nuccijdmnyurqzel");
                    using (var message = new MailMessage(
                        from: new MailAddress("info.studenthive@gmail.com", "StudentHive"),
                        to: new MailAddress(toEmail, name)
                        ))
                    {

                        message.Subject = "Köszöntjük a StudentHive diákmunka fórumon!";
                        message.Body = $"Sikeresen létrehoztuk önnek az iskolaszövetkezet profilját. \n Bejelentkezési adatok: \n Email: {toEmail} \n Jelszó: {plainPassword} \n Kérjük bejelentkezés után változtassa meg jelszavát!";

                        client.Send(message);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        }
        [HttpPut("settings/{userId}")]
        public async Task<IActionResult> UpdateAdminSettings(int userId, [FromBody] UpdateAdminSettingsRequest request)
        {
            if (string.IsNullOrEmpty(request.Password) && string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { message = "Legalább egy mezőnek (email vagy jelszó) meg kell változnia." });
            }

            try
            {
                const string selectQuery = "SELECT Id, Email, PasswordHash FROM Users WHERE Id = @UserId";
                var parameters = new[] { new MySqlParameter("@UserId", userId) };
                var result = await _dbHelper.ExecuteQueryAsync(selectQuery, parameters);

                if (result.Rows.Count == 0)
                {
                    return NotFound(new { message = "Felhasználó nem található!" });
                }

                if (!string.IsNullOrEmpty(request.Email))
                {
                    const string checkEmailQuery = "SELECT COUNT(1) FROM Users WHERE Email = @Email AND Id != @UserId";
                    var checkEmailParams = new[] {
                        new MySqlParameter("@Email", request.Email),
                        new MySqlParameter("@UserId", userId)
                    };
                    var emailExists = await _dbHelper.ExecuteScalarAsync<int>(checkEmailQuery, checkEmailParams);
                    if (emailExists > 0)
                    {
                        return BadRequest(new { message = "Ez az email cím már foglalt!" });
                    }

                    const string updateEmailQuery = "UPDATE Users SET Email = @Email WHERE Id = @UserId";
                    var emailParams = new[] {
                        new MySqlParameter("@Email", request.Email),
                        new MySqlParameter("@UserId", userId)
                    };
                    await _dbHelper.ExecuteNonQueryAsync(updateEmailQuery, emailParams);
                }

                if (!string.IsNullOrEmpty(request.Password))
                {
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
                    const string updatePasswordQuery = "UPDATE Users SET PasswordHash = @PasswordHash WHERE Id = @UserId";
                    var passwordParams = new[] {
                        new MySqlParameter("@PasswordHash", hashedPassword),
                        new MySqlParameter("@UserId", userId)
                    };
                    await _dbHelper.ExecuteNonQueryAsync(updatePasswordQuery, passwordParams);
                }

                return Ok(new { message = "A profil adatainak frissítése sikeres!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a profil frissítése közben.", details = ex.Message });
            }
        }


        public class NewOrganizationRequest
        {
            public string OrgName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public string Address { get; set; }
        }
        public class ChangePasswordRequest
        {
            public string NewPassword { get; set; }
        }
        public class UpdateOrganizationRequest
        {
            public string Name { get; set; }
            public string Address { get; set; }
            public string ContactEmail { get; set; }
            public string ContactPhone { get; set; }
        }
        public class UpdateAdminSettingsRequest
        {
            public string? Email { get; set; }
            public string? Password { get; set; }
        }
    }
}
