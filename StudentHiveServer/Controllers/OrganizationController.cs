using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.Data;
using System.Net;
using System.Security.Claims;
using System.Text.Json;

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

        // POST: Create new agent
        [HttpPost("new-agent")]
        public async Task<IActionResult> AddAgent([FromBody] NewAgentRequest request)
        {
            // Get the logged-in user's ID from the token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier); // JWT Claim for user ID
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value; // This is the user ID from the token

            // Generate password for new agent
            var plainPassword = GenerateRandomPassword();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);

            try
            {
                // Insert the new agent into the database
                const string insertQuery = @"INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, OrganizationId) 
                                            VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId, @OrganizationId)";
                var insertParameters = new MySqlParameter[]
                {
                    new MySqlParameter("@FirstName", request.FirstName),
                    new MySqlParameter("@LastName", request.LastName),
                    new MySqlParameter("@Email", request.NewAgentEmail),
                    new MySqlParameter("@PasswordHash", hashedPassword),
                    new MySqlParameter("@RoleId", 3), // RoleId 3 = Agent
                    new MySqlParameter("@OrganizationId", loggedInUserId) // Use the logged-in user ID for organization
                };

                await _dbHelper.ExecuteNonQueryAsync(insertQuery, insertParameters);

                return Ok(new { message = "Agent added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the agent.", details = ex.Message });
            }
        }

        [HttpPost("new-job")]
        public async Task<IActionResult> AddJob([FromBody] JobRequest request)
        {
            // Get user id from the JWT token (Claim)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier); // JWT Claim for user ID
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            // Validate input fields
            if (request == null || string.IsNullOrEmpty(request.Title) ||
                string.IsNullOrEmpty(request.City) || string.IsNullOrEmpty(request.Address) ||
                string.IsNullOrEmpty(request.OurOffer) || string.IsNullOrEmpty(request.MainTasks) ||
                string.IsNullOrEmpty(request.JobRequirements) || string.IsNullOrEmpty(request.Advantages))
            {
                return BadRequest(new { message = "Minden mező kitöltése kötelező!" }); // "All fields are required!"
            }

            // Begin a transaction to ensure data consistency
            try
            {
                // Insert into Description table
                const string descriptionQuery = @"
            INSERT INTO Description (OurOffer, MainTaks, JobRequirements, Advantages)
            VALUES (@OurOffer, @MainTaks, @JobRequirements, @Advantages);
            SELECT LAST_INSERT_ID();"; // This will return the last inserted ID

                var descriptionParameters = new[]
                {
            new MySqlParameter("@OurOffer", request.OurOffer),
            new MySqlParameter("@MainTaks", request.MainTasks),
            new MySqlParameter("@JobRequirements", request.JobRequirements),
            new MySqlParameter("@Advantages", request.Advantages)
        };

                // Use ExecuteScalarAsync to get the inserted Description ID
                var descriptionId = await _dbHelper.ExecuteScalarAsync<int>(descriptionQuery, descriptionParameters);

                // Check if the description ID is valid
                if (descriptionId <= 0)
                {
                    throw new Exception("Description insert failed, no valid ID returned.");
                }

                // Insert into Jobs table
                const string jobQuery = @"
            INSERT INTO Jobs (OrganizationId, CategoryId, DescriptionId, Title, City, Address, HourlyRate, AgentId)
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
            new MySqlParameter("@AgentId", DBNull.Value)  // Always null for AgentId
        };

                var result = await _dbHelper.ExecuteNonQueryAsync(jobQuery, jobParameters);

                if (result <= 0)
                {
                    throw new Exception("Job insert failed.");
                }

                return Ok(new { message = "A munka sikeresen létrehozva!" }); // "The job has been successfully created!"
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt az adatok feldolgozása során.", error = ex.Message }); // "An error occurred while processing the data."
            }
        }



        [HttpGet("jobs")]
        public async Task<IActionResult> GetJobs([FromQuery] bool? isActive)
        {
            // Get the logged-in user's ID from the token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {
                // Step 1: Get the OrganizationId for the logged-in user
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

                // Step 2: Fetch jobs for the organization, including category and description details
                var query = @"
            SELECT 
                j.Id, 
                j.Title, 
                j.CategoryId, 
                c.CategoryName AS CategoryName, 
                j.City, 
                j.Address, 
                j.HourlyRate, 
                NULL AS AgentId, 
                j.CreatedAt, 
                j.IsActive,
                j.DescriptionId,
                d.OurOffer, 
                d.MainTaks, 
                d.JobRequirements, 
                d.Advantages,
                u.FirstName AS AgentFirstName, 
                u.LastName AS AgentLastName, 
                o.Name AS OrganizationName 
            FROM Jobs j
            LEFT JOIN Categories c ON j.CategoryId = c.Id 
            LEFT JOIN Users u ON j.AgentId = u.Id 
            LEFT JOIN Organizations o ON j.OrganizationId = o.Id 
            LEFT JOIN Description d ON j.DescriptionId = d.Id 
            WHERE j.OrganizationId = @OrganizationId
            AND j.DescriptionId IS NOT NULL";

                if (isActive.HasValue)
                {
                    query += " AND j.IsActive = @IsActive";
                }

                var jobParameters = new[] {
            new MySqlParameter("@OrganizationId", organizationId),
            new MySqlParameter("@IsActive", 1) // Default to active jobs (IsActive = 1)
        };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, jobParameters);

                // Map the jobs to a list
                var jobs = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    CategoryName = row.Field<string>("CategoryName"),
                    City = row.Field<string>("City"),
                    Address = row.Field<string>("Address"),
                    HourlyRate = row.Field<int>("HourlyRate"),
                    AgentId = (int?)null,  // Ensure AgentId is always null
                    CreatedAt = row.Field<DateTime>("CreatedAt").ToString("yyyy-MM-dd"),
                    IsActive = row.Field<bool>("IsActive"),
                    DescriptionId = row.Field<int>("DescriptionId"),
                    OurOffer = row.Field<string>("OurOffer"),
                    MainTaks = row.Field<string>("MainTaks"),
                    JobRequirements = row.Field<string>("JobRequirements"),
                    Advantages = row.Field<string>("Advantages"),
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

        [HttpGet("agents")]
        public async Task<IActionResult> GetAgents()
        {
            // 1. Az autentikált felhasználó azonosítójának lekérdezése a JWT tokenből
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {
                // 2. Az aktuális felhasználó OrganizationId-jának lekérdezése
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

                // 3. Az adott szervezet ügynökeinek lekérdezése
                const string query = @"SELECT Id, FirstName, LastName, Email FROM Users WHERE OrganizationId = @OrganizationId AND RoleId=3"; ;
                var jobParameters = new[]
                {
            new MySqlParameter("@OrganizationId", organizationId)
        };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, jobParameters);

                // 4. Az ügynökök listájának leképezése
                var agents = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    FirstName = row.Field<string>("FirstName"),
                    LastName = row.Field<string>("LastName"),
                    Email = row.Field<string>("Email"),
                }).ToList();

                return Ok(agents);
            }
            catch (Exception ex)
            {
                // Hibakezelés
                return StatusCode(500, new { message = "Error fetching data", details = ex.Message });
            }
        }

        [HttpPatch("isactive/{jobId}")]
        public async Task<IActionResult> UpdateJobStatus(int jobId, [FromBody] JobStatusUpdateRequest request)
        {
            // Check if the user is authenticated
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier); // JWT Claim for user ID
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            try
            {
                // Step 1: Check if the job belongs to the logged-in user's organization
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
                    return Unauthorized(new { message = "You do not have permission to update this job's status." });
                }

                // Step 2: Update the IsActive status
                const string updateQuery = "UPDATE Jobs SET IsActive = @IsActive WHERE Id = @JobId";
                var updateParameters = new[]
                {
            new MySqlParameter("@IsActive", request.IsActive),
            new MySqlParameter("@JobId", jobId)
        };

                var result = await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParameters);

                if (result <= 0)
                {
                    return StatusCode(500, new { message = "An error occurred while updating the job status." });
                }

                return Ok(new { message = "Job status updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred while updating job status.", details = ex.Message });
            }
        }

        public class JobStatusUpdateRequest
        {
            public bool IsActive { get; set; }
        }


        [HttpDelete("delete-agent/{Id}")]
        public async Task<IActionResult> DeleteAgent(int Id)
        {
            try
            {
                // Delete the job
                const string deleteQuery = "DELETE FROM users WHERE Id = @Id";
                var deleteParameters = new[] { new MySqlParameter("@Id", Id) };

                await _dbHelper.ExecuteNonQueryAsync(deleteQuery, deleteParameters);

                return Ok(new { message = "Agent deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred while deleting the Agent.", details = ex.Message });
            }
        }

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
                // Step 1: Check if the job belongs to the logged-in user's organization
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

                // Step 2: Delete dependent records (Applications, Shifts, JobReviews)
                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM Applications WHERE JobId = @JobId", new[] { new MySqlParameter("@JobId", jobId) });
                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM Shifts WHERE JobId = @JobId", new[] { new MySqlParameter("@JobId", jobId) });
                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM JobReviews WHERE JobId = @JobId", new[] { new MySqlParameter("@JobId", jobId) });

                // Step 3: Optionally, delete the Description record if needed
                await _dbHelper.ExecuteNonQueryAsync("DELETE FROM Description WHERE Id IN (SELECT DescriptionId FROM Jobs WHERE Id = @JobId)", new[] { new MySqlParameter("@JobId", jobId) });

                // Step 4: Now delete the job itself
                const string deleteJobQuery = "DELETE FROM Jobs WHERE Id = @JobId";
                await _dbHelper.ExecuteNonQueryAsync(deleteJobQuery, new[] { new MySqlParameter("@JobId", jobId) });

                return Ok(new { message = "Job deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred while deleting the job.", details = ex.Message });
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

        public class NewAgentRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string NewAgentEmail { get; set; }
        }

        public class JobRequest
        {
            public string Title { get; set; }
            public int CategoryId { get; set; }
            public string City { get; set; }
            public string Address { get; set; }
            public int HourlyRate { get; set; }
            public string OurOffer { get; set; }
            public string MainTasks { get; set; }
            public string JobRequirements { get; set; }
            public string Advantages { get; set; }
        }

    }
}
