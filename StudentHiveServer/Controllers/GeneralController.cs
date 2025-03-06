using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.Data;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/general")]
    public class GeneralController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public GeneralController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpGet("workcards")]
        public async Task<IActionResult> GetWorkCards([FromQuery] string? search, [FromQuery] int? categoryId, [FromQuery] string? city)
        {
            var query = @"SELECT 
                    j.Id,
                    j.Title, 
                    j.HourlyRate, 
                    j.City, 
                    c.CategoryName, 
                    c.ImagePath 
                  FROM Jobs j
                  JOIN Categories c ON j.CategoryId = c.Id
                  WHERE j.IsActive = 1 AND j.AgentId IS NOT NULL";

            var parameters = new List<MySqlParameter>();

            if (!string.IsNullOrEmpty(search))
            {
                query += " AND j.Title LIKE @Search";
                parameters.Add(new MySqlParameter("@Search", $"%{search}%"));
            }

            if (categoryId.HasValue)
            {
                query += " AND j.CategoryId = @CategoryId";
                parameters.Add(new MySqlParameter("@CategoryId", categoryId.Value));
            }

            if (!string.IsNullOrEmpty(city))
            {
                query += " AND j.City = @City";
                parameters.Add(new MySqlParameter("@City", city));
            }

            query += " ORDER BY j.CreatedAt DESC";

            try
            {
                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters.ToArray());
                var workCards = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    Salary = row.Field<int>("HourlyRate").ToString("N0") + " Ft/óra",
                    Location = row.Field<string>("City"),
                    Category = row.Field<string>("CategoryName"),
                    Image = row.Field<string>("ImagePath")
                }).ToList();

                return Ok(workCards);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a munkák lekérdezése közben.", details = ex.Message });
            }
        }

        // GET: munka részletes adatai - public
        [HttpGet("workcards/{id}")]
        public async Task<IActionResult> GetWorkCardById(int id)
        {
            const string query = @"SELECT 
                                    j.Id,
                                    j.Title, 
                                    j.HourlyRate, 
                                    j.City,
                                    j.Address,
                                    c.CategoryName, 
                                    c.ImagePath,
                                    d.OurOffer,
                                    d.MainTaks,
                                    d.JobRequirements,
                                    d.Advantages
                                FROM Jobs j
                                JOIN Categories c ON j.CategoryId = c.Id
                                LEFT JOIN Description d ON j.DescriptionId = d.Id
                                WHERE j.Id = @Id";

            try
            {
                var parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@Id", id)
                };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters);

                if (dataTable.Rows.Count == 0)
                    return NotFound(new { message = "A keresett munka nem található." });

                var row = dataTable.Rows[0];

                var workCard = new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    Salary = row.Field<int>("HourlyRate").ToString("N0") + " Ft/óra",
                    City = row.Field<string>("City"),
                    Address = row.Field<string>("Address"),
                    Category = row.Field<string>("CategoryName"),
                    Image = row.Field<string>("ImagePath"),
                    OurOffer = row.Field<string?>("OurOffer") ?? "",
                    MainTasks = row.Field<string?>("MainTaks") ?? "",
                    JobRequirements = row.Field<string?>("JobRequirements") ?? "",
                    Advantages = row.Field<string?>("Advantages") ?? ""
                };

                return Ok(workCard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a munka lekérdezése közben.", details = ex.Message });
            }
        }
        // GET: minden város kilistázása - public
        [HttpGet("cities")]
        public async Task<IActionResult> GetCities()
        {
            try
            {
                const string query = "SELECT DISTINCT City FROM Jobs";
                var citiesTable = await _dbHelper.ExecuteQueryAsync(query);

                var cities = citiesTable.AsEnumerable()
                    .Select(row => new
                    {
                        City = row.Field<string>("City")
                    })
                    .ToList();

                return Ok(cities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a városok lekérdezése közben.", details = ex.Message });
            }
        }

        [HttpGet("alluser")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                const string query = "SELECT Id,OrganizationId,RoleId,FirstName,LastName,Email,IsActive,CreatedAt FROM Users";
                var usersTable = await _dbHelper.ExecuteQueryAsync(query);

                var users = usersTable.AsEnumerable()
                    .Select(row => new
                    {
                        Id = row.Field<int>("Id"),
                        OrganizationId = row.Field<int?>("OrganizationId"),
                        RoleId = row.Field<int?>("RoleId"),
                        FirstName = row.Field<string>("FirstName"),
                        LastName = row.Field<string>("LastName"),
                        Email = row.Field<string>("Email"),
                        IsActive = row.Field<Boolean>("IsActive"),
                        CreatedAt = row.Field<DateTime>("CreatedAt").ToString("yyyy-MM-dd")
                    })
                    .ToList();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a felhasználók lekérdezése közben.", details = ex.Message });
            }
        }

        [HttpPatch("update-user-status/{id}")]
        public async Task<IActionResult> UpdateUserStatus(int id)
        {
            try
            {
                const string checkUserQuery = "SELECT IsActive FROM Users WHERE Id = @Id";
                var checkParams = new MySqlParameter[] { new("@Id", id) };
                var userTable = await _dbHelper.ExecuteQueryAsync(checkUserQuery, checkParams);

                if (userTable.Rows.Count == 0)
                    return NotFound(new { message = "A felhasználó nem található." });

                bool currentStatus = userTable.Rows[0].Field<bool>("IsActive");
                bool newStatus = !currentStatus;

                const string updateQuery = "UPDATE Users SET IsActive = @NewStatus WHERE Id = @Id";
                var updateParams = new MySqlParameter[]
                {
                    new("@NewStatus", newStatus),
                    new("@Id", id)
                };

                await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParams);

                return Ok(new { message = "A felhasználó státusza sikeresen frissítve.", isActive = newStatus });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a frissítés során.", details = ex.Message });
            }
        }

        [HttpPatch("update-user-password/{id}")]
        public async Task<IActionResult> UpdateUserPassword(int id, [FromBody] PasswordUpdateRequest request)
        {
            try
            {
                const string checkUserQuery = "SELECT * FROM Users WHERE Id = @Id";
                var checkParams = new MySqlParameter[] { new("@Id", id) };
                var userTable = await _dbHelper.ExecuteQueryAsync(checkUserQuery, checkParams);

                if (userTable.Rows.Count == 0)
                    return NotFound(new { message = "User not found." });
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                const string updateQuery = "UPDATE Users SET PasswordHash = @Password WHERE Id = @Id";
                var updateParams = new MySqlParameter[]
                {
                    new("@Password", hashedPassword),
                    new("@Id", id)
                };

                await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParams);

                return Ok(new { message = "Password successfully updated." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the password.", details = ex.Message });
            }
        }

        [HttpPatch("update-user-profile/{id}")]
        public async Task<IActionResult> UpdateUserProfile(int id, [FromBody] UpdateUserProfileRequest request)
        {
            try
            {
                const string checkUserQuery = "SELECT * FROM Users WHERE Id = @Id";
                var checkParams = new MySqlParameter[] { new("@Id", id) };
                var userTable = await _dbHelper.ExecuteQueryAsync(checkUserQuery, checkParams);

                if (userTable.Rows.Count == 0)
                    return NotFound(new { message = "User not found." });

                const string updateQuery = "UPDATE Users SET FirstName = @FirstName, LastName = @LastName, Email = @Email WHERE Id = @Id";
                var updateParams = new MySqlParameter[]
                {
                    new("@FirstName", request.FirstName),
                    new("@LastName", request.LastName),
                    new("@Email", request.Email),
                    new("@Id", id)
                };

                await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParams);

                return Ok(new { message = "User profile successfully updated." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the profile.", details = ex.Message });
            }

        }

        public class UpdateUserProfileRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
        }

        public class PasswordUpdateRequest
        {
            public string NewPassword { get; set; }
        }


        public class UpdatePasswordRequest
        {
            public string NewPassword { get; set; }
        }


    }
}
