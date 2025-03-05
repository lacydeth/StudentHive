using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.Data;
using System.Net.Mail;
using System.Net;
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
        //GET: összes munka név - public
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
        //GET: közvetítőhöz rendelt munkák kilistázása - protected
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
        //GET: munka részletes adatai - public
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
        //GET: műszakok kilistázása - protected
        [HttpGet("manage-shifts/{jobId}")]
        public async Task<IActionResult> GetShiftsByJobId(int jobId)
        {
            const string query = @"SELECT 
                                        s.Id,
                                        s.ShiftStart,
                                        s.ShiftEnd,
                                        j.Title
                                    FROM Shifts s
                                    JOIN Jobs j ON j.Id = s.JobId
                                    WHERE s.JobId = @JobId
                                    AND s.ShiftStart >= NOW()"; 

            try
            {
                var parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@JobId", jobId) 
                };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters);

                if (dataTable.Rows.Count == 0)
                    return NotFound(new { message = "Nincsenek elérhető műszakok ehhez a munkához." });

                var shifts = new List<object>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var shiftDetails = new
                    {
                        Id = row.Field<int>("Id"),
                        ShiftStart = row.Field<DateTime>("ShiftStart"),
                        ShiftEnd = row.Field<DateTime>("ShiftEnd"),
                        JobTitle = row.Field<string>("Title")
                    };

                    shifts.Add(shiftDetails);
                }

                return Ok(shifts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a műszakok lekérdezése közben.", details = ex.Message });
            }
        }
        [HttpGet("job-title/{jobId}")]
        public async Task<IActionResult> JobTitle(int jobId)
        {
            string query = @"SELECT title from Jobs WHERE Id = @jobId";
            try
            {
                var parameter = new MySqlParameter[]
                {
                    new MySqlParameter("@JobId", jobId),
                };


                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameter);

                var applications = dataTable.AsEnumerable().Select(row => new
                {
                    Title = row.Field<string>("Title")
                }).ToList();

                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a pozíció betöltése során!", details = ex.Message });
            }

        }
        // Get distinct shiftStart values after the current date
        [HttpGet("shift-starts/{jobId}")]
        public async Task<IActionResult> GetDistinctShiftStarts(int jobId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }

            var loggedInUserId = userIdClaim.Value;

            string query = @"SELECT DISTINCT s.ShiftStart
                            FROM StudentShifts ss
                            JOIN Shifts s ON ss.ShiftId = s.Id
                            JOIN Jobs j ON s.JobId = j.Id
                            WHERE j.Id = @JobId AND j.AgentId = @AgentId AND s.ShiftStart > NOW()";

            try
            {
                var parameters = new List<MySqlParameter>
                {
                    new MySqlParameter("@JobId", jobId),
                    new MySqlParameter("@AgentId", loggedInUserId)
                };

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters.ToArray());

                var shiftStarts = dataTable.AsEnumerable().Select(row => row.Field<DateTime>("ShiftStart").ToString("yyyy-MM-dd HH:mm")).ToList();

                return Ok(shiftStarts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a műszakok betöltése során!", details = ex.Message });
            }
        }

        // GET: műszak jelentkezések kilistázása - protected, modified to check future dates
        [HttpGet("shift-applications/{jobId}")]
        public async Task<IActionResult> GetApplications(int jobId, [FromQuery] int? status = null, [FromQuery] DateTime? shiftStartFilter = null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }

            var loggedInUserId = userIdClaim.Value;

            string query = @"SELECT 
                                ss.Id AS ApplicationId,
                                s.ShiftStart,
                                s.ShiftEnd,
                                CONCAT(u.FirstName, ' ', u.LastName) AS StudentName,
                                ss.Approved AS ApprovedStatus,
                                j.Title AS JobTitle
                            FROM StudentShifts ss
                            JOIN Shifts s ON ss.ShiftId = s.Id
                            JOIN Jobs j ON s.JobId = j.Id
                            JOIN Users u ON ss.StudentId = u.Id
                            WHERE j.Id = @JobId AND j.AgentId = @AgentId AND s.ShiftStart > NOW()";

            if (status.HasValue)
                query += " AND ss.Approved = @Approved";

            if (shiftStartFilter.HasValue)
                query += " AND s.ShiftStart = @ShiftStartFilter";

            try
            {
                var parameters = new List<MySqlParameter>
                {
                    new MySqlParameter("@JobId", jobId),
                    new MySqlParameter("@AgentId", loggedInUserId)
                };

                if (status.HasValue)
                    parameters.Add(new MySqlParameter("@Approved", status));

                if (shiftStartFilter.HasValue)
                    parameters.Add(new MySqlParameter("@ShiftStartFilter", shiftStartFilter));

                var dataTable = await _dbHelper.ExecuteQueryAsync(query, parameters.ToArray());

                var applications = dataTable.AsEnumerable().Select(row => new
                {
                    ApplicationId = row.Field<int>("ApplicationId"),
                    StudentName = row.Field<string>("StudentName"),
                    ShiftStart = row.Field<DateTime>("ShiftStart").ToString("yyyy-MM-dd HH:mm"),
                    ShiftEnd = row.Field<DateTime>("ShiftEnd").ToString("yyyy-MM-dd HH:mm"),
                    ApprovedStatus = row.Field<int>("ApprovedStatus"),
                    JobTitle = row.Field<string>("JobTitle")
                }).ToList();

                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a jelentkezések betöltése során!", details = ex.Message });
            }
        }


        //PATCH: műszakra jelentkezés elfogadása: protected
        [HttpPatch("shift-applications/{id}/accept")]
        public async Task<IActionResult> AcceptShiftApplication(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }

            const string updateQuery = "UPDATE StudentShifts SET Approved = 1 WHERE Id = @Id";

            try
            {
                var updateParams = new MySqlParameter[] { new("@Id", id) };
                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParams);

                if (rowsAffected == 0)
                    return NotFound(new { message = "Jelentkezés nem található!" });

                return Ok(new { message = "Jelentkezés sikeresen elfogadva!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a jelentkezés elfogadása során!", details = ex.Message });
            }
        }
        //PATCH: műszakra jelentkezés elutasítása: protected
        [HttpPatch("shift-applications/{id}/decline")]
        public async Task<IActionResult> DeclineShiftApplication(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }

            const string updateQuery = "UPDATE StudentShifts SET Approved = 2 WHERE Id = @Id";

            try
            {
                var updateParams = new MySqlParameter[] { new("@Id", id) };
                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(updateQuery, updateParams);

                if (rowsAffected == 0)
                    return NotFound(new { message = "Jelentkezés nem található!" });

                return Ok(new { message = "Jelentkezés sikeresen elutasítva!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a jelentkezés elutasítása során!", details = ex.Message });
            }
        }
        //GET: jelentkezések kilistázása - protected
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
        //PATCH: jelentkezés elfogadása: protected
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
        //GET: közvetítőhöz tartozó diákok kilistázása - protected
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
        //POST: műszak hozzáadása - protected
        [HttpPost("add-shift")]
        public async Task<IActionResult> AddShift([FromBody] ShiftRequest shiftRequest)
        {
            if (shiftRequest == null || shiftRequest.JobId <= 0 || shiftRequest.ShiftStart == default || shiftRequest.ShiftEnd == default)
            {
                return BadRequest(new { message = "Érvénytelen adatok!" });
            }

            var budapestTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
            var shiftStartBudapest = TimeZoneInfo.ConvertTimeFromUtc(shiftRequest.ShiftStart, budapestTimeZone);
            var shiftEndBudapest = TimeZoneInfo.ConvertTimeFromUtc(shiftRequest.ShiftEnd, budapestTimeZone);

            if (shiftStartBudapest < DateTime.Now || shiftEndBudapest < DateTime.Now)
            {
                return BadRequest(new { message = "A műszak kezdő- vagy befejező időpontja nem lehet a jelenlegi dátum előtt!" });
            }

            if (shiftStartBudapest > DateTime.Now.AddDays(7))
            {
                return BadRequest(new { message = "A műszak kezdő időpontja nem lehet több, mint egy héttel a jelenlegi dátum után!" });
            }

            if (shiftEndBudapest < shiftStartBudapest)
            {
                return BadRequest(new { message = "A műszak befejező időpontja nem lehet korábbi, mint a kezdő időpont!" });
            }

            if ((shiftEndBudapest - shiftStartBudapest).TotalHours > 12)
            {
                return BadRequest(new { message = "A műszak hossza nem haladhatja meg a 24 órát!" });
            }

            const string query = "INSERT INTO Shifts (JobId, ShiftStart, ShiftEnd) VALUES (@JobId, @ShiftStart, @ShiftEnd)";

            var parameters = new MySqlParameter[]
            {
                new MySqlParameter("@JobId", shiftRequest.JobId),
                new MySqlParameter("@ShiftStart", shiftStartBudapest),
                new MySqlParameter("@ShiftEnd", shiftEndBudapest)
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
        //DELETE: műszak törlése - protected
        [HttpDelete("delete-shift/{id}")]
        public async Task<IActionResult> DeleteShift(int id)
        {
            const string getShiftQuery = "SELECT * FROM Shifts WHERE Id = @Id";
            const string getBookedUsersQuery = "SELECT StudentId FROM StudentShifts WHERE ShiftId = @ShiftId";
            const string deleteStudentShiftsQuery = "DELETE FROM StudentShifts WHERE ShiftId = @ShiftId";
            const string deleteShiftQuery = "DELETE FROM Shifts WHERE Id = @Id";

            try
            {
                var shiftParams = new MySqlParameter[] { new("@Id", id) };
                var shiftDataTable = await _dbHelper.ExecuteQueryAsync(getShiftQuery, shiftParams);

                if (shiftDataTable.Rows.Count == 0)
                    return NotFound(new { message = "Műszak nem található!" });

                var shiftRow = shiftDataTable.Rows[0];
                int jobId = shiftRow.Field<int>("JobId");
                DateTime shiftStart = shiftRow.Field<DateTime>("ShiftStart");
                DateTime shiftEnd = shiftRow.Field<DateTime>("ShiftEnd");

                var bookedUsersParams = new MySqlParameter[] { new("@ShiftId", id) };
                var bookedUsersDataTable = await _dbHelper.ExecuteQueryAsync(getBookedUsersQuery, bookedUsersParams);

                var userIds = bookedUsersDataTable.AsEnumerable()
                    .Select(row => row.Field<int>("StudentId"))
                    .ToList();

                await _dbHelper.ExecuteNonQueryAsync(deleteStudentShiftsQuery, bookedUsersParams);

                await _dbHelper.ExecuteNonQueryAsync(deleteShiftQuery, shiftParams);

                foreach (var userId in userIds)
                {
                    var userQuery = "SELECT Email, FirstName, LastName FROM Users WHERE Id = @UserId";
                    var userParams = new MySqlParameter[] { new("@UserId", userId) };
                    var userDataTable = await _dbHelper.ExecuteQueryAsync(userQuery, userParams);

                    if (userDataTable.Rows.Count > 0)
                    {
                        var userRow = userDataTable.Rows[0];
                        string email = userRow.Field<string>("Email");
                        string firstName = userRow.Field<string>("FirstName");
                        string lastName = userRow.Field<string>("LastName");

                        string message = $"Tisztelt {lastName} {firstName},\n\nA következő műszak törölve lett:\n\n" +
                                         $"Műszak kezdete: {shiftStart}\n" +
                                         $"Műszak vége: {shiftEnd}\n\n" +
                                         "Kérjük, jelentkezzen be a rendszerbe további információkért.\n\n" +
                                         "Üdvözlettel,\nA StudentHive csapata";

                        SendEmail(email, message, $"{lastName} {firstName}");
                    }
                }

                return Ok(new { message = "Műszak sikeresen törölve!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a műszak törlése során!", details = ex.Message });
            }
        }
        //PATCH: jelentkezés elutasítása - protected
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
        private void SendEmail(string toEmail, string emailBody, string name)
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

                    using (var mailMessage = new MailMessage(
                        from: new MailAddress("info.studenthive@gmail.com", "StudentHive"),
                        to: new MailAddress(toEmail, name)))
                    {
                        mailMessage.Subject = "Műszak törölve";
                        mailMessage.Body = emailBody;
                        mailMessage.IsBodyHtml = false; 

                        client.Send(mailMessage);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
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
