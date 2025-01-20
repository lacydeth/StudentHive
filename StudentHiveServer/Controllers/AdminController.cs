using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System;
using System.Data;

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

        // GET: list all organizations
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

        // POST: create new organization
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

        public class NewOrganizationRequest
        {
            public string OrgName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public string Address { get; set; }
        }
    }
}
