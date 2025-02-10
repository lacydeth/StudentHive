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
        [HttpGet("agent-work-cards")]
        public async Task<IActionResult> GetAgentWorkCards([FromQuery] int agentId)
        {
            var query = @"SELECT 
                            j.Id,
                            j.Title, 
                            j.City, 
                            c.CategoryName, 
                            c.ImagePath,
                            u.FirstName AS AgentFirstName,
                            u.LastName AS AgentLastName
                          FROM Jobs j
                          JOIN Categories c ON j.CategoryId = c.Id
                          JOIN Users u ON j.AgentId = u.Id
                          WHERE j.IsActive = 1 
                            AND j.AgentId = @AgentId
                            AND u.RoleId = 3";

            var parameters = new List<MySqlParameter>
            {
                new MySqlParameter("@AgentId", agentId)
            };

            try
            {
                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters.ToArray());
                var workCards = dataTable.AsEnumerable().Select(row => new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    Location = row.Field<string>("City"),
                    Category = row.Field<string>("CategoryName"),
                    Image = row.Field<string>("ImagePath"),
                    AgentName = $"{row.Field<string>("AgentLastName")} {row.Field<string>("AgentFirstName")}"
                }).ToList();

                return Ok(workCards);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a munkák lekérdezése közben.", details = ex.Message });
            }
        }
        [HttpGet("work-details/{id}")]
        public async Task<IActionResult> GetWorkDetailsById(int id)
        {
            const string query = @"SELECT 
                             j.Id,
                             j.Title, 
                             j.HourlyRate, 
                             j.City,
                             j.Address,
                             c.CategoryName, 
                             c.ImagePath,
                             u.FirstName AS AgentFirstName,
                             u.LastName AS AgentLastName
                         FROM Jobs j
                         JOIN Categories c ON j.CategoryId = c.Id
                         JOIN Users u ON j.AgentId = u.Id
                         WHERE j.Id = @Id;";

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

                var workDetails = new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    Salary = row.Field<int>("HourlyRate").ToString("N0") + " Ft/óra",
                    City = row.Field<string>("City"),
                    Address = row.Field<string>("Address"),
                    Category = row.Field<string>("CategoryName"),
                    Image = row.Field<string>("ImagePath"),
                    AgentName = $"{row.Field<string>("AgentLastName")} {row.Field<string>("AgentFirstName")}"
                };

                return Ok(workDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a munka lekérdezése közben.", details = ex.Message });
            }
        }

        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications([FromQuery] int agentId, [FromQuery] string? title = null, [FromQuery] int? status = null)
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
                     WHERE j.AgentId = @AgentId";

            if (status.HasValue)
                query += " AND a.Status = @Status";
            if (!string.IsNullOrEmpty(title))
                query += " AND j.Title = @Title";

            try
            {
                var parameters = new List<MySqlParameter>
                {
                    new MySqlParameter("@AgentId", agentId)
                };

                if (status.HasValue)
                    parameters.Add(new MySqlParameter("@Status", status));
                if (!string.IsNullOrEmpty(title))
                    parameters.Add(new MySqlParameter("@Title", title));

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
                return StatusCode(500, new { message = "Hiba a jelentkezések betöltése során!", details = ex.Message });
            }
        }

        [HttpPatch("applications/{id}/accept")]
        public async Task<IActionResult> AcceptApplication(int id)
        {
            const string updateQuery = "UPDATE Applications SET Status = 1 WHERE Id = @Id";
            const string insertAssignmentQuery = "INSERT INTO JobAssignments (UserId, JobId) VALUES (@UserId, @JobId)";

            try
            {
                string getApplicationQuery = @"SELECT a.StudentId, a.JobId, j.AgentId
                                                FROM Applications a
                                                JOIN Jobs j ON a.JobId = j.Id
                                                WHERE a.Id = @Id";

                var applicationParams = new MySqlParameter[] { new MySqlParameter("@Id", id) };
                var applicationDataTable = await _dbHelper.ExecuteQueryAsync(getApplicationQuery, applicationParams);

                if (applicationDataTable.Rows.Count == 0)
                    return NotFound(new { message = "Jelentkezés nem található!" });

                var row = applicationDataTable.Rows[0];
                int studentId = row.Field<int>("StudentId");
                int jobId = row.Field<int>("JobId");

                var updateParams = new MySqlParameter[] { new MySqlParameter("@Id", id) };
                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParams);

                if (rowsAffected == 0)
                    return NotFound(new { message = "Jelentkezés nem található!" });

                var insertParams = new MySqlParameter[]
                {
                    new MySqlParameter("@UserId", studentId),
                    new MySqlParameter("@JobId", jobId)
                };

                int assignmentRowsAffected = await _dbHelper.ExecuteNonQueryAsync(insertAssignmentQuery, insertParams);

                if (assignmentRowsAffected > 0)
                {
                    return Ok(new { message = "Jelentkezés sikeresen elfogadva és munkakörhöz rendelve!" });
                }

                return StatusCode(500, new { message = "Hiba a munkakörhöz való hozzárendelés során!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a jelentkezés elfogadása során!", details = ex.Message });
            }
        }

        [HttpGet("student-list")]
        public async Task<IActionResult> GetStudents()
        {
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
                                        ja.JobId,
                                        j.Title AS JobTitle
                                    FROM Users u
                                    INNER JOIN JobAssignments ja ON u.Id = ja.UserId
                                    INNER JOIN Jobs j ON ja.JobId = j.Id
                                    WHERE j.AgentId = @AgentId";

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
        [HttpPost("add-shift")]
        public async Task<IActionResult> AddShift([FromBody] ShiftRequest shiftRequest)
        {
            if (shiftRequest == null || shiftRequest.JobId <= 0 || shiftRequest.ShiftStart == default || shiftRequest.ShiftEnd == default)
            {
                return BadRequest(new { message = "Érvénytelen adatok!" });
            }

            if (shiftRequest.ShiftStart < DateTime.Now || shiftRequest.ShiftEnd < DateTime.Now)
            {
                return BadRequest(new { message = "A műszak kezdő- vagy befejező időpontja nem lehet a jelenlegi dátum előtt!" });
            }

            if (shiftRequest.ShiftEnd < shiftRequest.ShiftStart)
            {
                return BadRequest(new { message = "A műszak befejező időpontja nem lehet korábbi, mint a kezdő időpont!" });
            }

            const string query = "INSERT INTO Shifts (JobId, ShiftStart, ShiftEnd) VALUES (@JobId, @ShiftStart, @ShiftEnd)";

            var parameters = new MySqlParameter[]
            {
                new MySqlParameter("@JobId", shiftRequest.JobId),
                new MySqlParameter("@ShiftStart", shiftRequest.ShiftStart),
                new MySqlParameter("@ShiftEnd", shiftRequest.ShiftEnd)
            };

            try
            {
                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);

                if (rowsAffected > 0)
                    return Ok(new { message = "Műszak sikeresen hozzáadva!" });

                return StatusCode(500, new { message = "Hiba a műszak hozzáadása során!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a műszak hozzáadása során!", details = ex.Message });
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
                    return Ok(new { message = "Jelentkezés sikeresen elutasítva!" });

                return NotFound(new { message = "Jelentkezés nem található!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a jelentkezés elutasítása során!", details = ex.Message });
            }
        }
        public class ShiftRequest
        {
            public int JobId { get; set; }
            public DateTime ShiftStart { get; set; }
            public DateTime ShiftEnd { get; set; }
        }

    }
}
