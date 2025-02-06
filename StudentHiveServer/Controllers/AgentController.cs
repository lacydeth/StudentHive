using Microsoft.AspNetCore.Mvc;
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
        [HttpGet("work-titles")]
        public async Task<IActionResult> GetTitles()
        {
            try
            {
                const string query = "SELECT DISTINCT Title FROM Jobs";
                var worksTable = await _dbHelper.ExecuteQueryAsync(query);

                var works = worksTable.AsEnumerable()
                    .Select(row => new
                    {
                        Title = row.Field<string>("Title")
                    })
                    .ToList();

                return Ok(works);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a munkák lekérdezése közben.", details = ex.Message });
            }
        }
        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications([FromQuery] int agentId, [FromQuery] string title)
        {
            string query = @"SELECT 
                                a.*,
                                j.Title AS JobTitle,
                                CONCAT(u.FirstName, ' ', u.LastName) AS StudentName,
                                o.Name AS OrganizationName
                            FROM Applications a
                            JOIN Jobs j ON a.JobId = j.Id
                            JOIN Users u ON a.StudentId = u.Id
                            JOIN Organizations o ON j.OrganizationId = o.Id
                            WHERE a.Status = 0 AND j.AgentId = @AgentId";

            if (!string.IsNullOrEmpty(title))
            {
                query += " AND j.Title = @Title";
            }

            try
            {
                var parameters = new List<MySqlParameter>
                {
                    new MySqlParameter("@AgentId", agentId)
                };

                if (!string.IsNullOrEmpty(title))
                {
                    parameters.Add(new MySqlParameter("@Title", title));
                }

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters.ToArray());
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
                    return Ok(new { message = "Jelentkezés sikeresen elfogadva!" });

                return NotFound(new { message = "Jelentkezés nem található!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a jelentkezés elfogadása során!", details = ex.Message });
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
