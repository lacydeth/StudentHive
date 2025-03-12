using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.Data;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text.Json;
using static StudentHiveServer.Controllers.AdminController;
using static StudentHiveServer.Controllers.AgentController;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/organization")]
    public class OrganizationController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public OrganizationController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }
        //GET: létrehozott munkák és szövetkezethez tartozó diákok listázása - public
        [HttpGet("total-students-and-jobs/{orgId}")]
        public async Task<IActionResult> GetTotalStudentsAndJobs(int orgId)
        {
            const string query = @"
                SELECT 
                    (SELECT COUNT(*) FROM Users WHERE RoleId = 4 AND OrganizationId = @OrgId) AS TotalStudents,
                    (SELECT COUNT(*) FROM Jobs WHERE OrganizationId = @OrgId) AS TotalJobs";

            try
            {
                MySqlParameter[] parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@OrgId", orgId)
                };

                var result = await _dbHelper.ExecuteQueryAsync(query, parameters);
                var data = result.AsEnumerable().Select(row => new
                {
                    TotalStudents = row.Field<long>("TotalStudents"),
                    TotalJobs = row.Field<long>("TotalJobs")
                }).FirstOrDefault();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error fetching total students and jobs.",
                    details = ex.Message
                });
            }
        }
        //GET: létrehozott munkák az iskolaszövetkezet által - public
        [HttpGet("jobs-created-by-month/{orgId}")]
        public async Task<IActionResult> GetJobsCreatedByMonth(int orgId)
        {
            const string query = @"
                SELECT YEAR(CreatedAt) AS Year, MONTH(CreatedAt) AS Month, COUNT(*) AS UserCount
                FROM Jobs
                WHERE OrganizationId = @OrgId
                GROUP BY YEAR(CreatedAt), MONTH(CreatedAt)
                ORDER BY Year, Month";

            try
            {
                MySqlParameter[] parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@OrgId", orgId)
                };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters);
                var jobsByMonth = dataTable.AsEnumerable().Select(row => new
                {
                    year = row.Field<int>("Year"),
                    month = row.Field<int>("Month"),
                    userCount = row.Field<long>("UserCount")
                }).ToList();

                return Ok(jobsByMonth);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error fetching jobs created by month.",
                    details = ex.Message
                });
            }
        }
        //POST: új közvetítő hozzáadása - protected
        [HttpPost("new-agent")]
        public async Task<IActionResult> AddAgent([FromBody] NewAgentRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Felhasználó azonosítása sikertelen." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {
                const string checkEmailQuery = "SELECT COUNT(*) FROM Users WHERE Email = @Email";
                var checkEmailParam = new MySqlParameter("@Email", request.NewAgentEmail);

                var existingEmailCount = await _dbHelper.ExecuteScalarAsync<int>(checkEmailQuery, new[] { checkEmailParam });

                if (existingEmailCount > 0)
                {
                    return BadRequest(new { message = "A megadott email cím már használatban van." });
                }


                var plainPassword = GenerateRandomPassword();
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);

                const string insertQuery = @"INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, OrganizationId) 
                                     VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId, @OrganizationId)";

                var insertParameters = new MySqlParameter[]
                {
                    new MySqlParameter("@FirstName", request.FirstName),
                    new MySqlParameter("@LastName", request.LastName),
                    new MySqlParameter("@Email", request.NewAgentEmail),
                    new MySqlParameter("@PasswordHash", hashedPassword),
                    new MySqlParameter("@RoleId", 3),
                    new MySqlParameter("@OrganizationId", loggedInUserId)
                };

                await _dbHelper.ExecuteNonQueryAsync(insertQuery, insertParameters);
                SendEmail(request.NewAgentEmail, plainPassword, $"{request.LastName} {request.FirstName}");
                return Ok(new { message = "Közvetítő sikeresen hozzáadva." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba lépett fel a közvetítő hozzáadása közben.", details = ex.Message });
            }
        }
        //POST: új munka hozzáadása - protected
        [HttpPost("new-job")]
        public async Task<IActionResult> AddJob([FromBody] JobRequest request)
        {

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;


            if (request == null || string.IsNullOrEmpty(request.Title) ||
                string.IsNullOrEmpty(request.City) || string.IsNullOrEmpty(request.Address) ||
                string.IsNullOrEmpty(request.OurOffer) || string.IsNullOrEmpty(request.MainTaks) ||
                string.IsNullOrEmpty(request.JobRequirements) || string.IsNullOrEmpty(request.Advantages))
            {
                return BadRequest(new { message = "Minden mező kitöltése kötelező!" });
            }


            try
            {

                const string descriptionQuery = @"INSERT INTO Description (OurOffer, MainTaks, JobRequirements, Advantages)
                                                VALUES (@OurOffer, @MainTaks, @JobRequirements, @Advantages);
                                                SELECT LAST_INSERT_ID();";

                var descriptionParameters = new[]
                {
                    new MySqlParameter("@OurOffer", request.OurOffer),
                    new MySqlParameter("@MainTaks", request.MainTaks),
                    new MySqlParameter("@JobRequirements", request.JobRequirements),
                    new MySqlParameter("@Advantages", request.Advantages)
                };


                var descriptionId = await _dbHelper.ExecuteScalarAsync<int>(descriptionQuery, descriptionParameters);


                if (descriptionId <= 0)
                {
                    throw new Exception("Description insert failed, no valid ID returned.");
                }

                const string jobQuery = @"INSERT INTO Jobs (OrganizationId, CategoryId, DescriptionId, Title, City, Address, HourlyRate, AgentId)
                                        VALUES (@OrganizationId, @CategoryId, @DescriptionId, @Title, @City, @Address, @HourlyRate, @AgentId)";

                var jobParameters = new[]
                {
                    new MySqlParameter("@OrganizationId", loggedInUserId),
                    new MySqlParameter("@CategoryId", request.CategoryId),
                    new MySqlParameter("@DescriptionId", descriptionId),
                    new MySqlParameter("@Title", request.Title),
                    new MySqlParameter("@City", request.City),
                    new MySqlParameter("@Address", request.Address),
                    new MySqlParameter("@HourlyRate", request.HourlyRate),
                    new MySqlParameter("@AgentId", DBNull.Value)
                };

                var result = await _dbHelper.ExecuteNonQueryAsync(jobQuery, jobParameters);

                if (result <= 0)
                {
                    throw new Exception("Job insert failed.");
                }

                return Ok(new { message = "A munka sikeresen létrehozva!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt az adatok feldolgozása során.", error = ex.Message });
            }
        }
        //GET: szövetkezethez tartozó munkák - protected
        [HttpGet("jobs")]
        public async Task<IActionResult> GetJobs([FromQuery] bool? isActive)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {

                const string getOrganizationQuery = "SELECT OrganizationId FROM Users WHERE Id = @UserId";
                var organizationParameters = new[] {
                    new MySqlParameter("@UserId", loggedInUserId)
                };

                var organizationTable = await _dbHelper.ExecuteQueryAsync(getOrganizationQuery, organizationParameters);
                if (organizationTable.Rows.Count == 0)
                {
                    return Unauthorized(new { message = "User does not belong to any organization." });
                }

                var organizationId = organizationTable.Rows[0].Field<int>("OrganizationId");


                var query = @"SELECT 
                                    j.Id, 
                                    j.Title, 
                                    c.CategoryName AS CategoryName, 
                                    j.City, 
                                    j.Address, 
                                    j.HourlyRate, 
                                    NULL AS AgentId, 
                                    j.CreatedAt, 
                                    j.IsActive,
                                    u.FirstName AS AgentFirstName, 
                                    u.LastName AS AgentLastName, 
                                    o.Name AS OrganizationName 
                                FROM Jobs j
                                LEFT JOIN Categories c ON j.CategoryId = c.Id 
                                LEFT JOIN Users u ON j.AgentId = u.Id 
                                LEFT JOIN Organizations o ON j.OrganizationId = o.Id 
                                WHERE j.OrganizationId = @OrganizationId
                                AND j.DescriptionId IS NOT NULL";

                if (isActive.HasValue)
                {
                    query += " AND j.IsActive = @IsActive";
                }

                var jobParameters = new[] {
                    new MySqlParameter("@OrganizationId", organizationId),
                    new MySqlParameter("@IsActive", 1)
                };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, jobParameters);

                var jobs = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    CategoryName = row.Field<string>("CategoryName"),
                    City = row.Field<string>("City"),
                    Address = row.Field<string>("Address"),
                    HourlyRate = row.Field<int>("HourlyRate"),
                    AgentId = (int?)null,
                    CreatedAt = row.Field<DateTime>("CreatedAt").ToString("yyyy-MM-dd"),
                    IsActive = row.Field<bool>("IsActive"),
                    AgentFirstName = row.Field<string>("AgentFirstName"),
                    AgentLastName = row.Field<string>("AgentLastName"),
                    OrganizationName = row.Field<string>("OrganizationName")
                }).ToList();

                return Ok(jobs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading data!", details = ex.Message });
            }
        }
        //GET: elérhető kategóriák listázása - public
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                const string query = "SELECT Id, CategoryName FROM Categories";
                var categoriesTable = await _dbHelper.ExecuteQueryAsync(query);

                var categories = categoriesTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    CategoryName = row.Field<string>("CategoryName")
                }).ToList();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching categories.", details = ex.Message });
            }
        }
        //PATCH: közvetítő munkához rendelése - protected
        [HttpPatch("assign-agent/{agentId}/{JobId}")]
        public async Task<IActionResult> PatchJobs(int agentId, int JobId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || roleClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;
            var userRole = roleClaim.Value;

            if (userRole != "Organization")
            {
                return Unauthorized(new { message = "You do not have the required permissions." });
            }

            try
            {
                const string getOrganizationQuery = "SELECT OrganizationId FROM Users WHERE Id = @UserId";
                var organizationParams = new[] { new MySqlParameter("@UserId", loggedInUserId) };
                var organizationTable = await _dbHelper.ExecuteQueryAsync(getOrganizationQuery, organizationParams);

                if (organizationTable.Rows.Count == 0)
                {
                    return Unauthorized(new { message = "User does not belong to any organization." });
                }

                var organizationId = organizationTable.Rows[0].Field<int>("OrganizationId");

                const string updateQuery = "UPDATE Jobs SET AgentId = @AgentId WHERE Id = @JobId";
                var parameters = new[]
                {
                    new MySqlParameter("@AgentId", agentId),
                    new MySqlParameter("@JobId", JobId),
                    new MySqlParameter("@OrganizationId", organizationId)
                };

                var result = await _dbHelper.ExecuteNonQueryAsync(updateQuery, parameters);

                if (result <= 0)
                {
                    return StatusCode(500, new { message = "An error occurred while updating the job." });
                }

                return Ok(new { message = "Agent successfully assigned to job." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred while assigning agent.", details = ex.Message });
            }
        }
        //GET: iskolaszövetkezethez tartozó közvetítők - protected
        [HttpGet("agents")]
        public async Task<IActionResult> GetAgents()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {
                const string getOrganizationQuery = "SELECT OrganizationId FROM Users WHERE Id = @UserId";
                var organizationParameters = new[]
                {
                    new MySqlParameter("@UserId", loggedInUserId)
                };

                var organizationTable = await _dbHelper.ExecuteQueryAsync(getOrganizationQuery, organizationParameters);
                if (organizationTable.Rows.Count == 0)
                {
                    return Unauthorized(new { message = "User does not belong to any organization." });
                }

                var organizationId = organizationTable.Rows[0].Field<int>("OrganizationId");

                const string query = @"
                                        SELECT Id, FirstName, LastName, Email, IsActive 
                                        FROM Users 
                                        WHERE OrganizationId = @OrganizationId AND RoleId = 3";

                var jobParameters = new[]
                {
                    new MySqlParameter("@OrganizationId", organizationId)
                };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, jobParameters);

                var agents = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    FirstName = row.Field<string>("FirstName"),
                    LastName = row.Field<string>("LastName"),
                    Email = row.Field<string>("Email"),
                    IsActive = row.Field<bool>("IsActive") ? 1 : 0
                }).ToList();

                return Ok(agents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching data", details = ex.Message });
            }
        }
        //PATCH: munka státuszának változtatása - protected
        [HttpPatch("toggle-job-status/{jobId}")]
        public async Task<IActionResult> UpdateJobStatus(int jobId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || roleClaim == null)
            {
                return Unauthorized(new { message = "Felhasználói hitelesítés szükséges." });
            }

            var loggedInUserId = userIdClaim.Value;
            var userRole = roleClaim.Value;

            if (userRole != "Organization")
            {
                return Unauthorized(new { message = "Nincs hozzá megfelelő jogosultságod." });
            }

            try
            {
                const string checkQuery = "SELECT OrganizationId FROM Jobs WHERE Id = @JobId";
                var checkParameters = new[] { new MySqlParameter("@JobId", jobId) };

                var jobTable = await _dbHelper.ExecuteQueryAsync(checkQuery, checkParameters);

                if (jobTable.Rows.Count == 0)
                {
                    return NotFound(new { message = "Munka nem található." });
                }

                var organizationId = jobTable.Rows[0].Field<int>("OrganizationId");

                if (organizationId != int.Parse(loggedInUserId))
                {
                    return Unauthorized(new { message = "Nincs megfelelő jogosultságod a státusz megváltoztatásához." });
                }

                const string getStatusQuery = "SELECT IsActive FROM Jobs WHERE Id = @JobId";
                var currentStatus = await _dbHelper.ExecuteScalarAsync<int>(getStatusQuery, checkParameters);

                int newStatus = currentStatus == 1 ? 0 : 1;

                const string updateQuery = "UPDATE Jobs SET IsActive = @IsActive WHERE Id = @JobId";
                var updateParameters = new[]
                {
                    new MySqlParameter("@IsActive", newStatus),
                    new MySqlParameter("@JobId", jobId)
                };

                await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParameters);

                return Ok(new { message = newStatus == 1 ? "Munka sikeresen aktiválva." : "Munka sikeresen deaktiválva" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a státusz megváltoztatása során.", details = ex.Message });
            }
        }
        //GET: közvetítő státuszának változtatása - protected
        [HttpPatch("toggle-agent-status/{Id}")]
        public async Task<IActionResult> ToggleAgentStatus(int Id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || roleClaim == null)
            {
                return Unauthorized(new { message = "Felhasználói hitelesítés szükséges." });
            }

            var loggedInUserId = userIdClaim.Value;
            var userRole = roleClaim.Value;

            if (userRole != "Organization")
            {
                return Unauthorized(new { message = "Nincs hozzá megfelelő jogosultságod." });
            }

            try
            {
                const string checkQuery = "SELECT OrganizationId FROM users WHERE Id = @Id";
                var checkParameters = new[] { new MySqlParameter("@Id", Id) };

                var userTable = await _dbHelper.ExecuteQueryAsync(checkQuery, checkParameters);

                if (userTable.Rows.Count == 0)
                {
                    return NotFound(new { message = "Felhasználó nem található." });
                }

                var organizationId = userTable.Rows[0].Field<int>("OrganizationId");

                if (organizationId != int.Parse(loggedInUserId))
                {
                    return Unauthorized(new { message = "Nincs megfelelő jogosultságod a státusz megváltoztatásához." });
                }

                const string getStatusQuery = "SELECT IsActive FROM users WHERE Id = @Id";
                var currentStatus = await _dbHelper.ExecuteScalarAsync<int>(getStatusQuery, checkParameters);

                int newStatus = currentStatus == 1 ? 0 : 1;

                const string updateQuery = "UPDATE users SET IsActive = @IsActive WHERE Id = @Id";
                var updateParameters = new[]
                {
                    new MySqlParameter("@IsActive", newStatus),
                    new MySqlParameter("@Id", Id)
                };

                await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParameters);

                return Ok(new { message = newStatus == 1 ? "Közvetítő sikeresen aktiválva." : "Közvetítő sikeresen deaktiválva" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a státusz megváltoztatása során.", details = ex.Message });
            }
        }
        //PUT: munka adatainak módosítása - protected
        [HttpPut("update-job/{jobId}")]
        public async Task<IActionResult> UpdateJob(int jobId, [FromBody] JobRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid job data.");
            }

            var jobQuery = @"UPDATE Jobs 
                            SET Title = @Title, 
                                Address = @Address, 
                                HourlyRate = @HourlyRate, 
                                City = @City,
                                CategoryId = @CategoryId
                            WHERE Id = @JobId";

            var jobParameters = new MySqlParameter[]
            {
                new MySqlParameter("@Title", request.Title),
                new MySqlParameter("@Address", request.Address),
                new MySqlParameter("@HourlyRate", request.HourlyRate),
                new MySqlParameter("@City", request.City),
                new MySqlParameter("@CategoryId", request.CategoryId),
                new MySqlParameter("@JobId", jobId)
            };

            try
            {
                var jobRowsAffected = await _dbHelper.ExecuteNonQueryAsync(jobQuery, jobParameters);
                if (jobRowsAffected == 0)
                {
                    return NotFound("Job not found.");
                }

                var descriptionQuery = @"UPDATE Description 
                                        SET OurOffer = @OurOffer, 
                                            MainTaks = @MainTaks, 
                                            JobRequirements = @JobRequirements, 
                                            Advantages = @Advantages
                                        WHERE Id = (SELECT DescriptionId FROM Jobs WHERE Id = @JobId)";

                var descriptionParameters = new MySqlParameter[]
                {
                    new MySqlParameter("@OurOffer", request.OurOffer),
                    new MySqlParameter("@MainTaks", request.MainTaks),
                    new MySqlParameter("@JobRequirements", request.JobRequirements),
                    new MySqlParameter("@Advantages", request.Advantages),
                    new MySqlParameter("@JobId", jobId)
                };

                var descriptionRowsAffected = await _dbHelper.ExecuteNonQueryAsync(descriptionQuery, descriptionParameters);
                if (descriptionRowsAffected == 0)
                {
                    return NotFound("Description not found for the job.");
                }

                return Ok("Job updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        //DELETE: munka törlése - protected
        [HttpDelete("delete-job/{jobId}")]
        public async Task<IActionResult> DeleteJob(int jobId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {

                const string checkQuery = "SELECT OrganizationId FROM Jobs WHERE Id = @JobId";
                var checkParameters = new[] { new MySqlParameter("@JobId", jobId) };

                var jobTable = await _dbHelper.ExecuteQueryAsync(checkQuery, checkParameters);

                if (jobTable.Rows.Count == 0)
                {
                    return NotFound(new { message = "Job not found." });
                }

                var organizationId = jobTable.Rows[0].Field<int>("OrganizationId");

                if (organizationId != int.Parse(loggedInUserId))
                {
                    return Unauthorized(new { message = "You do not have permission to delete this job." });
                }


                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM Applications WHERE JobId = @JobId", new[] { new MySqlParameter("@JobId", jobId) });
                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM Shifts WHERE JobId = @JobId", new[] { new MySqlParameter("@JobId", jobId) });
                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM JobReviews WHERE JobId = @JobId", new[] { new MySqlParameter("@JobId", jobId) });
                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM Description WHERE Id IN (SELECT DescriptionId FROM Jobs WHERE Id = @JobId)", new[] { new MySqlParameter("@JobId", jobId) });
                const string deleteJobQuery = "DELETE FROM Jobs WHERE Id = @JobId";
                await _dbHelper.ExecuteNonQueryAsync(deleteJobQuery, new[] { new MySqlParameter("@JobId", jobId) });

                return Ok(new { message = "Job deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred while deleting the job.", details = ex.Message });
            }
        }
        [HttpPut("profilesettings")]
        public async Task<IActionResult> UpdateAgentSettings([FromBody] UpdateAgentSettingsRequest request)
        {
            if (string.IsNullOrEmpty(request.FirstName) && string.IsNullOrEmpty(request.LastName) &&
                string.IsNullOrEmpty(request.Email) && string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Legalább egy mezőnek (first name, last name, email vagy password) meg kell változnia." });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {
                const string selectQuery = "SELECT Id, Email, PasswordHash, FirstName, LastName FROM Users WHERE Id = @UserId";
                var parameters = new[] { new MySqlParameter("@UserId", loggedInUserId) };
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
                new MySqlParameter("@UserId", loggedInUserId)
            };
                    var emailExists = await _dbHelper.ExecuteScalarAsync<int>(checkEmailQuery, checkEmailParams);
                    if (emailExists > 0)
                    {
                        return BadRequest(new { message = "Ez az email cím már foglalt!" });
                    }

                    const string updateEmailQuery = "UPDATE Users SET Email = @Email WHERE Id = @UserId";
                    var emailParams = new[] {
                new MySqlParameter("@Email", request.Email),
                new MySqlParameter("@UserId", loggedInUserId)
            };
                    await _dbHelper.ExecuteNonQueryAsync(updateEmailQuery, emailParams);
                }

                if (!string.IsNullOrEmpty(request.FirstName))
                {
                    const string updateFirstNameQuery = "UPDATE Users SET FirstName = @FirstName WHERE Id = @UserId";
                    var firstNameParams = new[] {
                new MySqlParameter("@FirstName", request.FirstName),
                new MySqlParameter("@UserId", loggedInUserId)
            };
                    await _dbHelper.ExecuteNonQueryAsync(updateFirstNameQuery, firstNameParams);
                }

                if (!string.IsNullOrEmpty(request.LastName))
                {
                    const string updateLastNameQuery = "UPDATE Users SET LastName = @LastName WHERE Id = @UserId";
                    var lastNameParams = new[] {
                new MySqlParameter("@LastName", request.LastName),
                new MySqlParameter("@UserId", loggedInUserId)
            };
                    await _dbHelper.ExecuteNonQueryAsync(updateLastNameQuery, lastNameParams);
                }

                if (!string.IsNullOrEmpty(request.Password))
                {
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
                    const string updatePasswordQuery = "UPDATE Users SET PasswordHash = @PasswordHash WHERE Id = @UserId";
                    var passwordParams = new[] {
                new MySqlParameter("@PasswordHash", hashedPassword),
                new MySqlParameter("@UserId", loggedInUserId)
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


        [HttpPut("company-settings")]
        public async Task<IActionResult> UpdateOrganizationCompanySettings([FromBody] UpdateOrganizationCompanyRequest request)
        {
            if (string.IsNullOrEmpty(request.Name) &&
                string.IsNullOrEmpty(request.Address) &&
                string.IsNullOrEmpty(request.ContactEmail) &&
                string.IsNullOrEmpty(request.ContactPhone))
            {
                return BadRequest(new { message = "Legalább egy mezőt meg kell változtatni." });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            if (!int.TryParse(userIdClaim.Value, out int loggedInUserId))
            {
                return BadRequest(new { message = "Érvénytelen felhasználói azonosító." });
            }

            try
            {
                // Lekérdezzük az aktuális adatokat
                const string selectQuery = @"
            SELECT o.Id, o.Name, o.Address, o.ContactEmail, o.ContactPhone 
            FROM Organizations o
            INNER JOIN Users u ON u.OrganizationId = o.Id
            WHERE u.Id = @UserId";

                var parameters = new[] { new MySqlParameter("@UserId", loggedInUserId) };
                var currentData = await _dbHelper.ExecuteQueryAsync(selectQuery, parameters);

                if (currentData.Rows.Count == 0)
                {
                    return NotFound(new { message = "Szervezet nem található!" });
                }

                // Az aktuális adatok beolvasása
                var currentRow = currentData.Rows[0];
                string currentName = currentRow["Name"]?.ToString() ?? "";
                string currentAddress = currentRow["Address"]?.ToString() ?? "";
                string currentEmail = currentRow["ContactEmail"]?.ToString() ?? "";
                string currentPhone = currentRow["ContactPhone"]?.ToString() ?? "";

                // Ellenőrizzük, hogy történt-e változás
                bool hasChanges = false;
                List<string> updateFields = new List<string>();
                List<MySqlParameter> updateParams = new List<MySqlParameter>();

                if (!string.IsNullOrEmpty(request.Name) && request.Name != currentName)
                {
                    updateFields.Add("Name = @Name");
                    updateParams.Add(new MySqlParameter("@Name", request.Name));
                    hasChanges = true;
                }
                if (!string.IsNullOrEmpty(request.Address) && request.Address != currentAddress)
                {
                    updateFields.Add("Address = @Address");
                    updateParams.Add(new MySqlParameter("@Address", request.Address));
                    hasChanges = true;
                }
                if (!string.IsNullOrEmpty(request.ContactEmail) && request.ContactEmail != currentEmail)
                {
                    updateFields.Add("ContactEmail = @ContactEmail");
                    updateParams.Add(new MySqlParameter("@ContactEmail", request.ContactEmail));
                    hasChanges = true;
                }
                if (!string.IsNullOrEmpty(request.ContactPhone) && request.ContactPhone != currentPhone)
                {
                    updateFields.Add("ContactPhone = @ContactPhone");
                    updateParams.Add(new MySqlParameter("@ContactPhone", request.ContactPhone));
                    hasChanges = true;
                }
                if (!hasChanges)
                {
                    return Ok(new { message = "Nem történt változás, nincs szükség frissítésre." });
                }
                string updateQuery = $"UPDATE Organizations SET {string.Join(", ", updateFields)} WHERE Id = @OrgId";
                updateParams.Add(new MySqlParameter("@OrgId", currentRow["Id"]));

                await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParams.ToArray());

                return Ok(new { message = "A szervezet adatai sikeresen frissültek!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a céges adatok frissítése közben.", details = ex.Message });
            }
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
                        message.Body = $"Önt regisztrálták a StudentHive platformra mint közvetítő. \n Bejelentkezési adatok: \n Név: {name} \n Email: {toEmail} \n Jelszó: {plainPassword} \n Kérjük bejelentkezés után változtassa meg jelszavát!";

                        client.Send(message);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
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
        public class JobStatusUpdateRequest
        {
            public bool IsActive { get; set; }
        }
        public class NewAgentRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string NewAgentEmail { get; set; }
        }
        public class UpdateOrganizationProfileRequest
        {
            public string? Password { get; set; }
            public string? Email { get; set; }
        }
        public class UpdateOrganizationCompanyRequest
        {
            public string? Name { get; set; }
            public string? Address { get; set; }
            public string? ContactEmail { get; set; }
            public string? ContactPhone { get; set; }
        }
        public class JobRequest
        {
            public string Title { get; set; }
            public string CategoryId { get; set; }
            public string Address { get; set; }
            public int HourlyRate { get; set; }
            public string City { get; set; }
            public string OurOffer { get; set; }
            public string MainTaks { get; set; }
            public string JobRequirements { get; set; }
            public string Advantages { get; set; }
        }

    }
}