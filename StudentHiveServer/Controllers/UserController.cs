using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using StudentHiveServer.Utils;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public UserController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] ApplicationRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User is not authenticated." });
                }

                var loggedInUserId = int.Parse(userIdClaim.Value);

                if (request.JobId <= 0)
                {
                    return BadRequest(new { message = "Érvénytelen munkalehetőség." });
                }

                string checkQuery = "SELECT COUNT(*) FROM Applications WHERE JobId = @JobId AND StudentId = @StudentId";
                var checkParams = new MySqlParameter[]
                {
            new MySqlParameter("@JobId", request.JobId),
            new MySqlParameter("@StudentId", loggedInUserId)
                };

                int existingApplications = await _dbHelper.ExecuteScalarAsync<int>(checkQuery, checkParams);
                if (existingApplications > 0)
                {
                    return Conflict(new { message = "Már jelentkeztél erre a munkára." });
                }

                string insertQuery = "INSERT INTO Applications (JobId, StudentId, Status) VALUES (@JobId, @StudentId, @Status)";
                var insertParams = new MySqlParameter[]
                {
                    new MySqlParameter("@JobId", request.JobId),
                    new MySqlParameter("@StudentId", loggedInUserId),
                    new MySqlParameter("@Status", request.Status)
                };

                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(insertQuery, insertParams);
                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Sikeres jelentkezés!" });
                }
                else
                {
                    return StatusCode(500, new { message = "Hiba történt a jelentkezés során." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Belső hiba: " + ex.Message });
            }
        }

    }

    public class ApplicationRequest
    {
            public int JobId { get; set; }
            
            public int StudentId { get; set; }

            public int Status { get; set; } = 0;
    }
}
