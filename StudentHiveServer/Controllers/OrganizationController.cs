﻿using Microsoft.AspNetCore.Mvc;
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier); // JWT Claim for user ID
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value;

            if (request == null || string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Category) || string.IsNullOrEmpty(request.Location))
            {
                return BadRequest(new { message = "Minden mező kitöltése kötelező!" });
            }

            try
            {
                // Az AgentId mindig null
                int? agentId = null;  // Mindig null az AgentId

                const string query = @"INSERT INTO jobs (OrganizationId, Title, Category, Location, Description, HourlyRate, ImagePath, AgentId)
                               VALUES (@OrganizationId, @Title, @Category, @Location, @Description, @HourlyRate, @ImagePath, @AgentId)";

                var parameters = new[]
                {
            new MySqlParameter("@OrganizationId", loggedInUserId),
            new MySqlParameter("@Title", request.Title),
            new MySqlParameter("@Category", request.Category),
            new MySqlParameter("@Location", request.Location),
            new MySqlParameter("@Description", request.Description),
            new MySqlParameter("@HourlyRate", request.HourlyRate),
            new MySqlParameter("@ImagePath", request.ImagePath),
            new MySqlParameter("@AgentId", (object)agentId ?? DBNull.Value)  // Null mindig
        };

                await _dbHelper.ExecuteNonQueryAsync(query, parameters);

                return Ok(new { message = "A munka sikeresen létrehozva!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt az adatok feldolgozása során.", error = ex.Message });
            }
        }

        [HttpGet("jobs")]
        public async Task<IActionResult> GetJobs()
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

                // Step 2: Fetch jobs for the organization, including agent details
                const string query = @"
            SELECT 
                j.Id, 
                j.Title, 
                j.Category, 
                j.Location, 
                j.HourlyRate, 
                j.AgentId, 
                j.CreatedAt, 
                u.FirstName AS AgentFirstName, 
                u.LastName AS AgentLastName, 
                o.Name AS OrganizationName 
            FROM Jobs j
            JOIN Users u ON j.AgentId = u.Id 
            JOIN Organizations o ON j.OrganizationId = o.Id 
            WHERE j.OrganizationId = @OrganizationId";

                var jobParameters = new[] {
            new MySqlParameter("@OrganizationId", organizationId)
        };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, jobParameters);

                // Map the jobs to a list
                var jobs = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    Category = row.Field<string>("Category"),
                    Location = row.Field<string>("Location"),
                    HourlyRate = row.Field<int>("HourlyRate"),
                    AgentFirstName = row.Field<string>("AgentFirstName"),
                    AgentLastName = row.Field<string>("AgentLastName"),
                    OrganizationName = row.Field<string>("OrganizationName"),
                    CreatedAt = row.Field<DateTime>("CreatedAt").ToString("yyyy-MM-dd")
                }).ToList();

                return Ok(jobs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba az adatok betöltése során!", details = ex.Message });
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
                // Check if the job belongs to the logged-in user's organization
                const string checkQuery = "SELECT OrganizationId FROM Jobs WHERE Id = @JobId";
                var checkParameters = new[] { new MySqlParameter("@JobId", jobId) };

                var jobTable = await _dbHelper.ExecuteQueryAsync(checkQuery, checkParameters);

                if (jobTable.Rows.Count == 0)
                {
                    return NotFound(new { message = "Job not found." });
                }

                // Delete the job
                const string deleteQuery = "DELETE FROM Jobs WHERE Id = @JobId";
                var deleteParameters = new[] { new MySqlParameter("@JobId", jobId) };

                await _dbHelper.ExecuteNonQueryAsync(deleteQuery, deleteParameters);

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
            public int OrganizationId { get; set; }
            public int AgentId { get; set; } = 0;
            public string Title { get; set; }
            public string Category { get; set; }
            public string Location { get; set; }
            public string Description { get; set; }
            public double HourlyRate { get; set; }
            public string ImagePath { get; set; }
        }

    }
}
