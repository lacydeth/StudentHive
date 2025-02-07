﻿using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.Data;
using System.Security.Claims;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/agent")]
    public class AgentController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public AgentController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications()
        {
            const string query = @"SELECT 
                                    a.*,
                                    j.Title AS JobTitle,
                                    CONCAT(u.FirstName, ' ', u.LastName) AS StudentName,
                                    o.Name AS OrganizationName
                                FROM Applications a
                                JOIN Jobs j ON a.JobId = j.Id
                                JOIN Users u ON a.StudentId = u.Id
                                JOIN Organizations o ON j.OrganizationId = o.Id WHERE a.Status = 0";

            try
            {
                var dataTable = await _dbHelper.ExecuteQueryAsync(query);
                var applications = dataTable.AsEnumerable().Select(row => new
                {
                    ApplicationId = row.Field<int>("Id"),
                    JobId = row.Field<int>("JobId"),
                    JobTitle = row.Field<string>("JobTitle"),
                    StudentId = row.Field<int>("StudentId"),
                    StudentName = row.Field<string>("StudentName"),
                    Organization = row.Field<string>("OrganizationName"),
                    Status = row.Field<int>("Status"),
                    AppliedDate = row.Field<DateTime>("AppliedAt").ToString("yyyy-MM-dd HH:mm")
                }).ToList();

                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading applications!", details = ex.Message });
            }
        }

        [HttpPatch("applications/{id}/accept")]
        public async Task<IActionResult> AcceptApplication(int id)
        {
            const string query = "UPDATE Applications SET Status = 1 WHERE Id = @Id";

            try
            {
                var parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@Id", id)
                };

                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);

                if (rowsAffected > 0)
                    return Ok(new { message = "Application accepted successfully!" });

                return NotFound(new { message = "Application not found!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error accepting application!", details = ex.Message });
            }
        }

        [HttpGet("student-list")]
        public async Task<IActionResult> GetStudents()
        {
            // Ellenőrizzük, hogy a felhasználó hitelesített-e
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = int.Parse(userIdClaim.Value);

            const string query = @"
        SELECT 
            u.Id AS StudentId, 
            u.FirstName, 
            u.LastName, 
            u.Email, 
            a.JobId,
            j.Title AS JobTitle
        FROM Users u
        INNER JOIN Applications a ON u.Id = a.StudentId
        INNER JOIN Jobs j ON a.JobId = j.Id
        WHERE a.Status = 1 AND j.AgentId = @AgentId";

            try
            {
                var parameters = new MySqlParameter[]
                {
            new MySqlParameter("@AgentId", loggedInUserId)
                };

                DataTable dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters);
                var students = dataTable.AsEnumerable().Select(row => new
                {
                    StudentId = row.Field<int>("StudentId"),
                    FirstName = row.Field<string>("FirstName"),
                    LastName = row.Field<string>("LastName"),
                    Email = row.Field<string>("Email"),
                    JobId = row.Field<int>("JobId"),
                    JobTitle = row.Field<string>("JobTitle")
                }).ToList();

                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading students!", details = ex.Message });
            }
        }


        [HttpPatch("applications/{id}/decline")]
        public async Task<IActionResult> DeclineApplication(int id)
        {
            const string query = "UPDATE Applications SET Status = 2 WHERE Id = @Id";

            try
            {
                var parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@Id", id)
                };

                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);

                if (rowsAffected > 0)
                    return Ok(new { message = "Application declined successfully!" });

                return NotFound(new { message = "Application not found!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error declining application!", details = ex.Message });
            }
        }
    }
}
