using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using StudentHiveServer.Utils;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Data;

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
        [HttpGet("user-jobs")]
        public async Task<IActionResult> GetUserJobs()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }
            var loggedInUserId = userIdClaim.Value;

            string query = @"SELECT 
                                j.Id AS JobId,
                                j.Title,
                                j.City,
                                j.Address,
                                j.HourlyRate,
                                o.Name AS OrganizationName,
                                c.ImagePath,
                                c.CategoryName,
                                CONCAT(a.LastName, ' ', a.FirstName) AS AgentName
                            FROM JobAssignments ja
                            JOIN Jobs j ON ja.JobId = j.Id
                            JOIN Organizations o ON j.OrganizationId = o.Id
                            JOIN Categories c ON j.CategoryId = c.Id
                            LEFT JOIN Users a ON j.AgentId = a.Id
                            WHERE ja.UserId = @Id AND j.IsActive = 1";
            var parameters = new MySqlParameter[]
            {
                new MySqlParameter("@Id", loggedInUserId),
            };
            var result = await _dbHelper.ExecuteQueryAsync(query, parameters);
            if (result.Rows.Count == 0)
            {
                return NotFound(new { message = "Nem található hozzárendelt munka." });
            }
            var jobs = new List<object>();
            foreach (DataRow row in result.Rows)
            {
                jobs.Add(new
                {
                    JobId = row["JobId"],
                    Title = row["Title"],
                    City = row["City"],
                    Address = row["Address"],
                    HourlyRate = row["HourlyRate"],
                    ImagePath = row["ImagePath"],
                    OrganizationName = row["OrganizationName"],
                    CategoryName = row["CategoryName"],
                    AgentName = row["AgentName"] != DBNull.Value ? row["AgentName"] : "Nincs kijelölt közvetítő."
                });
            }
            return Ok(jobs);
        }
        //GET: felhasználói profil nevének lekérése - protected
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfileName()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }

            var loggedInUserId = userIdClaim.Value;

            string query = "SELECT FirstName, LastName FROM Users WHERE Id = @Id";
            var parameters = new MySqlParameter[]
            {
                new MySqlParameter("@Id", loggedInUserId)
            };
            var result = await _dbHelper.ExecuteQueryAsync(query, parameters);
            if (result.Rows.Count == 0)
            {
                return NotFound(new { message = "Felhasználó nem található!" });
            }
            return Ok(new
            {
                firstName = result.Rows[0]["FirstName"],
                lastName = result.Rows[0]["LastName"]
            });
        }
        //POST: jelentkezés leadása - protected
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
        [HttpGet("list-shifts/{jobId}/date/{date}")]
        public async Task<IActionResult> GetShiftsForJobByDate(int jobId, string date)
        {
            try
            {
                DateTime selectedDate = DateTime.Parse(date);

                string query = @"SELECT s.Id, s.ShiftStart, s.ShiftEnd, j.Title, j.Id AS JobId
                                FROM Shifts s
                                INNER JOIN Jobs j ON s.JobId = j.Id
                                WHERE s.JobId = @JobId AND DATE(s.ShiftStart) = @SelectedDate
                                ORDER BY s.ShiftStart";

                var parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@JobId", jobId),
                    new MySqlParameter("@SelectedDate", selectedDate.ToString("yyyy-MM-dd"))
                };

                var result = await _dbHelper.ExecuteQueryAsync(query, parameters);

                if (result.Rows.Count == 0)
                {
                    return NotFound(new { message = "Nincs elérhető műszak a kiválasztott időpontban." });
                }

                var shifts = new List<object>();
                foreach (DataRow row in result.Rows)
                {
                    shifts.Add(new
                    {
                        Id = row["Id"],
                        StartTime = ((DateTime)row["ShiftStart"]).ToString("yyyy-MM-dd HH:mm"),
                        EndTime = ((DateTime)row["ShiftEnd"]).ToString("yyyy-MM-dd HH:mm"),
                        Title = row["Title"],
                        jobId = row["JobId"]
                    });
                }

                return Ok(shifts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a lekérdezés közben: " + ex.Message });
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
