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
        [HttpGet("user-applications")]
        public async Task<IActionResult> GetUserApplications()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }
            var loggedInUserId = userIdClaim.Value;
            string query = @"SELECT 
                                a.Id,
                                j.Title,
                                a.AppliedAt,
                                a.Status
                            FROM Applications a
                            JOIN Jobs j ON a.JobId = j.Id
                            WHERE a.StudentId = @Id";
            var parameters = new MySqlParameter[]
            {
                new MySqlParameter("@Id", loggedInUserId),
            };
            var result = await _dbHelper.ExecuteQueryAsync(query, parameters);
            if (result.Rows.Count == 0)
            {
                return NotFound(new { message = "Nem található jelentkezés." });
            }
            var applications = new List<object>();
            foreach (DataRow row in result.Rows)
            {
                applications.Add(new
                {
                    Id = row["Id"],
                    Title = row["Title"],
                    AppliedAt = ((DateTime)row["AppliedAt"]).ToString("yyyy-MM-dd HH:mm"),
                    Status = row["Status"]
                });
            }
            return Ok(applications);
        }
        [HttpDelete("delete-application/{applicationId}")]
        public async Task<IActionResult> DeleteApplication(int applicationId)
        {

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "A felhasználói azonosítás sikertelen!" });
            }

            string checkQuery = "SELECT StudentId FROM Applications WHERE Id = @Id";
            var checkParameters = new MySqlParameter[]
            {
                new MySqlParameter("@Id", applicationId)
            };
            var checkResult = await _dbHelper.ExecuteQueryAsync(checkQuery, checkParameters);

            if (checkResult.Rows.Count == 0)
            {
                return NotFound(new { message = "Jelentkezés nem található!" });
            }

            var applicationUserId = checkResult.Rows[0]["StudentId"].ToString();
            if (applicationUserId != userIdClaim.Value)
            {
                return Unauthorized(new { message = "Nincs jogosultságod a jelentkezés törléséhez!" });
            }

            string deleteQuery = "DELETE FROM Applications WHERE Id = @Id";
            var deleteParameters = new MySqlParameter[]
            {
                new MySqlParameter("@Id", applicationId)
            };
            int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(deleteQuery, deleteParameters);

            if (rowsAffected == 0)
            {
                return NotFound(new { message = "Jelentkezés nem található!" });
            }

            return Ok(new { message = "Jelentkezés sikeresen törölve!" });
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
        [HttpGet("list-user-shifts/date/{date}")]
        public async Task<IActionResult> GetUserShiftsByDate(string date)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Felhasználó azonosítása sikertelen." });
                }

                DateTime selectedDate = DateTime.Parse(date);

                string query = @"SELECT s.Id, s.ShiftStart, s.ShiftEnd, j.Title, us.Approved, j.Id AS JobId
                                FROM Shifts s
                                INNER JOIN Jobs j ON s.JobId = j.Id
                                INNER JOIN StudentShifts us ON s.Id = us.ShiftId
                                WHERE us.StudentId = @UserId AND DATE(s.ShiftStart) = @SelectedDate
                                ORDER BY s.ShiftStart";

                var parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@UserId", userId),
                    new MySqlParameter("@SelectedDate", selectedDate.ToString("yyyy-MM-dd"))
                };

                var result = await _dbHelper.ExecuteQueryAsync(query, parameters);

                if (result.Rows.Count == 0)
                {
                    return Ok(new List<object>()); // Return empty array instead of 404
                }

                var shifts = new List<object>();
                foreach (DataRow row in result.Rows)
                {

                    shifts.Add(new
                    {
                        id = row["Id"].ToString(),
                        title = row["Title"].ToString(),
                        shiftStart = ((DateTime)row["ShiftStart"]).ToString("yyyy-MM-dd HH:mm"),
                        shiftEnd = ((DateTime)row["ShiftEnd"]).ToString("yyyy-MM-dd HH:mm"),
                        approvedStatus = Convert.ToInt32(row["Approved"]),
                        jobId = row["JobId"].ToString()
                    });
                }

                return Ok(shifts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a lekérdezés közben: " + ex.Message });
            }
        }

        [HttpDelete("delete-shift/{shiftId}")]
        public async Task<IActionResult> DeleteUserShift(string shiftId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Felhasználó azonosítása sikertelen." });
                }

                string checkQuery = @"SELECT s.ShiftStart 
                                    FROM Shifts s 
                                    INNER JOIN StudentShifts us ON s.Id = us.ShiftId 
                                    WHERE s.Id = @ShiftId AND us.StudentId = @UserId";

                var checkParams = new MySqlParameter[]
                {
                    new MySqlParameter("@ShiftId", shiftId),
                    new MySqlParameter("@UserId", userId)
                };

                var checkResult = await _dbHelper.ExecuteQueryAsync(checkQuery, checkParams);

                if (checkResult.Rows.Count == 0)
                {
                    return NotFound(new { message = "A műszak nem található vagy nem tartozik ehhez a felhasználóhoz." });
                }

                DateTime shiftStart = (DateTime)checkResult.Rows[0]["ShiftStart"];
                TimeSpan timeUntilShift = shiftStart - DateTime.Now;

                if (timeUntilShift.TotalHours < 12)
                {
                    return BadRequest(new { message = "A műszak nem törölhető, mert kevesebb mint 12 óra van a kezdetéig." });
                }

                string deleteQuery = "DELETE FROM StudentShifts WHERE ShiftId = @ShiftId AND StudentId = @UserId";

                var deleteParams = new MySqlParameter[]
                {
                    new MySqlParameter("@ShiftId", shiftId),
                    new MySqlParameter("@UserId", userId)
                };

                int rowsAffected = await _dbHelper.ExecuteNonQueryAsync(deleteQuery, deleteParams);

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Műszak sikeresen törölve." });
                }
                else
                {
                    return StatusCode(500, new { message = "Hiba történt a műszak törlése közben." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba a lekérdezés közben: " + ex.Message });
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
        [HttpGet("student-details-datas")]
        public async Task<IActionResult> GetStudentDetails()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Felhasználói azonosítás sikertelen." });
            }

            var loggedInUserId = int.Parse(userIdClaim.Value);

            try
            {
                string query = @"
            SELECT 
                u.FirstName, u.LastName, u.Email,
                sd.PhoneNumber, sd.DateOfBirth, sd.BirthName, sd.MothersName,
                sd.CountryOfBirth, sd.PlaceOfBirth, sd.Gender, sd.Citizenship,
                sd.StudentCardNumber, sd.BankAccountNumber, sd.Country, sd.PostalCode,
                sd.City, sd.Address, sd.SchoolName, sd.StudyStartDate, sd.StudyEndDate
            FROM Users u
            INNER JOIN StudentDetails sd ON u.Id = sd.UserId
            WHERE u.Id = @UserId";

                var userParam = new MySqlParameter("@UserId", loggedInUserId);
                var dataTable = await _dbHelper.ExecuteQueryAsync(query, new MySqlParameter[] { userParam });

                if (dataTable.Rows.Count == 0)
                {
                    return NotFound(new { message = "A keresett felhasználó adatai nem találhatóak." });
                }

                var row = dataTable.Rows[0];

                var studentDetails = new
                {
                    FirstName = row.Field<string>("FirstName"),
                    LastName = row.Field<string>("LastName"),
                    Email = row.Field<string>("Email"),
                    PhoneNumber = row.Field<string?>("PhoneNumber"),
                    DateOfBirth = row.IsNull("DateOfBirth") ? null : ((DateTime?)row["DateOfBirth"])?.ToString("yyyy-MM-dd"),
                    BirthName = row.Field<string?>("BirthName"),
                    MothersName = row.Field<string?>("MothersName"),
                    CountryOfBirth = row.Field<string?>("CountryOfBirth"),
                    PlaceOfBirth = row.Field<string?>("PlaceOfBirth"),
                    Gender = row.Field<string?>("Gender"),
                    Citizenship = row.Field<string>("Citizenship"),
                    StudentCardNumber = row.Field<string?>("StudentCardNumber"),
                    BankAccountNumber = row.Field<string?>("BankAccountNumber"),
                    Country = row.Field<string?>("Country"),
                    PostalCode = row.Field<string?>("PostalCode"),
                    City = row.Field<string?>("City"),
                    Address = row.Field<string?>("Address"),
                    SchoolName = row.Field<string?>("SchoolName"),
                    StudyStartDate = row.IsNull("StudyStartDate") ? null : ((DateTime?)row["StudyStartDate"])?.ToString("yyyy-MM-dd"),
                    StudyEndDate = row.IsNull("StudyEndDate") ? null : ((DateTime?)row["StudyEndDate"])?.ToString("yyyy-MM-dd")
                };

                return Ok(studentDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt az adatok lekérésekor.", error = ex.Message });
            }
        }




        [HttpPut("student-details")]
        public async Task<IActionResult> UpsertStudentDetails([FromBody] StudentDetails request)
        {
            var useridClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (useridClaim == null)
            {
                return Unauthorized(new { message = "Felhasználói azonosítás sikertelen." });
            }

            var loggedInUserId = int.Parse(useridClaim.Value);

            bool isUserUpdated = false;
            var updateUserQuery = string.Empty;
            var parameters = new List<MySqlParameter>();

            if (request.FirstName != null || request.LastName != null || request.Email != null)
            {
                updateUserQuery = @"
            UPDATE Users 
            SET FirstName = IFNULL(@FirstName, FirstName), 
                LastName = IFNULL(@LastName, LastName),
                Email = IFNULL(@Email, Email)
            WHERE Id = @UserId";

                if (request.FirstName != null)
                {
                    parameters.Add(new MySqlParameter("@FirstName", request.FirstName));
                }
                if (request.LastName != null)
                {
                    parameters.Add(new MySqlParameter("@LastName", request.LastName));
                }
                if (request.Email != null)
                {
                    parameters.Add(new MySqlParameter("@Email", request.Email));
                }
                parameters.Add(new MySqlParameter("@UserId", loggedInUserId));

                var result = await _dbHelper.ExecuteNonQueryAsync(updateUserQuery, parameters.ToArray());
                if (result > 0)
                {
                    isUserUpdated = true;
                }
            }

            const string updateStudentDetailsQuery = @"
        INSERT INTO StudentDetails (UserId, PhoneNumber, DateOfBirth, BirthName, MothersName, 
                                    CountryOfBirth, PlaceOfBirth, Gender, Citizenship, StudentCardNumber, 
                                    BankAccountNumber, Country, PostalCode, City, Address, SchoolName, 
                                    StudyStartDate, StudyEndDate)
        VALUES (@UserId, @PhoneNumber, @DateOfBirth, @BirthName, @MothersName, @CountryOfBirth, 
                @PlaceOfBirth, @Gender, @Citizenship, @StudentCardNumber, @BankAccountNumber, 
                @Country, @PostalCode, @City, @Address, @SchoolName, @StudyStartDate, @StudyEndDate)
        ON DUPLICATE KEY UPDATE 
            PhoneNumber = @PhoneNumber, DateOfBirth = @DateOfBirth, BirthName = @BirthName, 
            MothersName = @MothersName, CountryOfBirth = @CountryOfBirth, PlaceOfBirth = @PlaceOfBirth, 
            Gender = @Gender, Citizenship = @Citizenship, StudentCardNumber = @StudentCardNumber, 
            BankAccountNumber = @BankAccountNumber, Country = @Country, PostalCode = @PostalCode, 
            City = @City, Address = @Address, SchoolName = @SchoolName, StudyStartDate = @StudyStartDate, 
            StudyEndDate = @StudyEndDate";

            var studentDetailsParams = new MySqlParameter[]
            {
        new MySqlParameter("@UserId", loggedInUserId),
        new MySqlParameter("@PhoneNumber", request.PhoneNumber ?? (object)DBNull.Value),
        new MySqlParameter("@DateOfBirth", request.DateOfBirth ?? (object)DBNull.Value),
        new MySqlParameter("@BirthName", request.BirthName ?? (object)DBNull.Value),
        new MySqlParameter("@MothersName", request.MothersName ?? (object)DBNull.Value),
        new MySqlParameter("@CountryOfBirth", request.CountryOfBirth ?? (object)DBNull.Value),
        new MySqlParameter("@PlaceOfBirth", request.PlaceOfBirth ?? (object)DBNull.Value),
        new MySqlParameter("@Gender", request.Gender ?? (object)DBNull.Value),
        new MySqlParameter("@Citizenship", request.Citizenship ?? (object)DBNull.Value),
        new MySqlParameter("@StudentCardNumber", request.StudentCardNumber ?? (object)DBNull.Value),
        new MySqlParameter("@BankAccountNumber", request.BankAccountNumber ?? (object)DBNull.Value),
        new MySqlParameter("@Country", request.Country ?? (object)DBNull.Value),
        new MySqlParameter("@PostalCode", request.PostalCode ?? (object)DBNull.Value),
        new MySqlParameter("@City", request.City ?? (object)DBNull.Value),
        new MySqlParameter("@Address", request.Address ?? (object)DBNull.Value),
        new MySqlParameter("@SchoolName", request.SchoolName ?? (object)DBNull.Value),
        new MySqlParameter("@StudyStartDate", request.StudyStartDate ?? (object)DBNull.Value),
        new MySqlParameter("@StudyEndDate", request.StudyEndDate ?? (object)DBNull.Value)
            };

            await _dbHelper.ExecuteNonQueryAsync(updateStudentDetailsQuery, studentDetailsParams);

            return Ok(new { message = "Sikeres módosítás!" });
        }





        public class StudentDetails
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; } // Changed to string, phone numbers are typically stored as strings
            public string? DateOfBirth { get; set; } // Changed to DateTime, assuming it's a date
            public string BirthName { get; set; }
            public string MothersName { get; set; }
            public string CountryOfBirth { get; set; }
            public string PlaceOfBirth { get; set; }
            public string Gender { get; set; }
            public string Citizenship { get; set; }
            public string StudentCardNumber { get; set; } // Changed to string, student card numbers can have leading zeros
            public string BankAccountNumber { get; set; } // Changed to string, bank account numbers can also have leading zeros
            public string Country { get; set; }
            public string PostalCode { get; set; } // Changed to string, postal codes can sometimes contain letters or leading zeros
            public string City { get; set; }
            public string Address { get; set; }
            public string SchoolName { get; set; }
            public string? StudyStartDate { get; set; }
            public string? StudyEndDate { get; set; }
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