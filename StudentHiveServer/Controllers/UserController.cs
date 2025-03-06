using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using StudentHiveServer.Utils;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Data;
using Org.BouncyCastle.Asn1.X509;
using System.Diagnostics.Metrics;
using System.Reflection;

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
                        JobId = row["JobId"],
                    });
                }

                return Ok(shifts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a lekérdezés közben: " + ex.Message });
            }
        }
        //POST: műszakra jelentkezés leadása - protected
        [HttpPost("apply-shift")]
        public async Task<IActionResult> ApplyToShift([FromBody] UserShiftRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Felhasználói azonosítás sikertelen." });
                }

                var loggedInUserId = int.Parse(userIdClaim.Value);

                if (request.ShiftId <= 0)
                {
                    return BadRequest(new { message = "Érvénytelen műszak." });
                }

                string checkQuery = "SELECT COUNT(*) FROM StudentShifts WHERE ShiftId = @ShiftId AND StudentId = @StudentId";
                var checkParams = new MySqlParameter[]
                {
                    new MySqlParameter("@ShiftId", request.ShiftId),
                    new MySqlParameter("@StudentId", loggedInUserId)
                };

                int existingApplications = await _dbHelper.ExecuteScalarAsync<int>(checkQuery, checkParams);
                if (existingApplications > 0)
                {
                    return Conflict(new { message = "Már jelentkeztél erre a műszakra." });
                }

                string insertQuery = "INSERT INTO StudentShifts (StudentId, ShiftId, Approved) VALUES (@StudentId, @ShiftId, @Approved)";
                var insertParams = new MySqlParameter[]
                {
                    new MySqlParameter("@ShiftId", request.ShiftId),
                    new MySqlParameter("@StudentId", loggedInUserId),
                    new MySqlParameter("@Approved", request.Status)
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
        [HttpPost("student-details")]
        public async Task<IActionResult> UpsertStudentDetails([FromBody] StudentDetails request)
        {
            try
            {
                string checkQuery = "SELECT COUNT(*) FROM StudentDetails WHERE UserId = @UserId";
                var checkParam = new MySqlParameter("@UserId", request.UserId);
                int count = Convert.ToInt32(await _dbHelper.ExecuteScalarAsync<int>(checkQuery, new MySqlParameter[] { checkParam }));

                string query;
                if (count == 0)
                {
                    query = @"
                INSERT INTO StudentDetails 
                (UserId, PhoneNumber, DateOfBirth, BirthName, MothersName, CountryOfBirth, PlaceOfBirth, Gender, Citizenship, 
                 StudentCardNumber, BankAccountNumber, Country, PostalCode, City, Address, SchoolName, StudyStartDate, StudyEndDate)
                VALUES 
                (@UserId, @PhoneNumber, @DateOfBirth, @BirthName, @MothersName, @CountryOfBirth, @PlaceOfBirth, @Gender, @Citizenship, 
                 @StudentCardNumber, @BankAccountNumber, @Country, @PostalCode, @City, @Address, @SchoolName, @StudyStartDate, @StudyEndDate)";
                }
                else
                {
                    query = @"
                UPDATE StudentDetails 
                SET PhoneNumber = @PhoneNumber,
                    DateOfBirth = @DateOfBirth,
                    BirthName = @BirthName,
                    MothersName = @MothersName,
                    CountryOfBirth = @CountryOfBirth,
                    PlaceOfBirth = @PlaceOfBirth,
                    Gender = @Gender,
                    Citizenship = @Citizenship,
                    StudentCardNumber = @StudentCardNumber,
                    BankAccountNumber = @BankAccountNumber,
                    Country = @Country,
                    PostalCode = @PostalCode,
                    City = @City,
                    Address = @Address,
                    SchoolName = @SchoolName,
                    StudyStartDate = @StudyStartDate,
                    StudyEndDate = @StudyEndDate
                WHERE UserId = @UserId";
                }

                var parameters = new MySqlParameter[]
                {
            new MySqlParameter("@UserId", request.UserId),
            new MySqlParameter("@PhoneNumber", (object?)request.PhoneNumber ?? DBNull.Value),
            new MySqlParameter("@DateOfBirth", (object?)request.DateOfBirth ?? DBNull.Value),
            new MySqlParameter("@BirthName", (object?)request.BirthName ?? DBNull.Value),
            new MySqlParameter("@MothersName", (object?)request.MothersName ?? DBNull.Value),
            new MySqlParameter("@CountryOfBirth", (object?)request.CountryOfBirth ?? DBNull.Value),
            new MySqlParameter("@PlaceOfBirth", (object?)request.PlaceOfBirth ?? DBNull.Value),
            new MySqlParameter("@Gender", (object?)request.Gender ?? DBNull.Value),
            new MySqlParameter("@Citizenship", (object?)request.Citizenship ?? DBNull.Value),
            new MySqlParameter("@StudentCardNumber", (object?)request.StudentCardNumber ?? DBNull.Value),
            new MySqlParameter("@BankAccountNumber", (object?)request.BankAccountNumber ?? DBNull.Value),
            new MySqlParameter("@Country", (object?)request.Country ?? DBNull.Value),
            new MySqlParameter("@PostalCode", (object?)request.PostalCode ?? DBNull.Value),
            new MySqlParameter("@City", (object?)request.City ?? DBNull.Value),
            new MySqlParameter("@Address", (object?)request.Address ?? DBNull.Value),
            new MySqlParameter("@SchoolName", (object?)request.SchoolName ?? DBNull.Value),
            new MySqlParameter("@StudyStartDate", (object?)request.StudyStartDate ?? DBNull.Value),
            new MySqlParameter("@StudyEndDate", (object?)request.StudyEndDate ?? DBNull.Value)
                };

                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);

                return Ok(new { message = count == 0 ? "Felhasználói adatok létrehozva!" : "Felhasználói adatok frissítve!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt: " + ex.Message });
            }
        }



        public class StudentDetails 
        { 
            public int UserId { get; set; }
            public int PhoneNumber { get; set; }
            public int DateOfBirth { get; set; }
            public string BirthName { get; set; }
            public string MothersName { get; set; }
            public string CountryOfBirth { get; set; }
            public string PlaceOfBirth { get; set; }
            public string Gender { get; set; }
            public string Citizenship { get; set; }
            public int StudentCardNumber { get; set; }
            public int BankAccountNumber { get; set; }
            public string Country { get; set; }
            public int PostalCode { get; set; }
            public string City { get; set; }
            public string Address { get; set; }
            public string SchoolName { get; set; }
            public DateTime StudyStartDate { get; set; }
            public DateTime StudyEndDate { get; set; }
        }
        public class UserShiftRequest
        {
            public int ShiftId { get; set; }
            public int Status { get; set; } = 0;
        }
        public class ApplicationRequest
        {
            public int JobId { get; set; }

            public int StudentId { get; set; }

            public int Status { get; set; } = 0;
        }
    }
}