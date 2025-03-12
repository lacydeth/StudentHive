using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public AuthController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }
        //POST: új fiók regisztrálása - public
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!IsValidEmail(request.Email))
            {
                return BadRequest(new { message = "Hibás email formátum!" });
            }

            if (!IsValidPassword(request.Password))
            {
                return BadRequest(new { message = "A jelszónak tartalmaznia kell legalább egy nagybetűt, egy számot, és 8-15 karakter hosszúnak kell lennie!" });
            }

            const string checkEmailQuery = "SELECT COUNT(*) FROM Users WHERE Email = @Email";
            var checkEmailParams = new MySqlParameter("@Email", request.Email);
            var emailCount = Convert.ToInt32(await _dbHelper.ExecuteScalarAsync<int>(checkEmailQuery, new[] { checkEmailParams }));

            if (emailCount > 0)
            {
                return Conflict(new { message = "Ez az emailcím már foglalt!" });
            }

            const string insertQuery = "INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId) VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId)";
            var parameters = new MySqlParameter[] {
        new MySqlParameter("@FirstName", request.FirstName),
        new MySqlParameter("@LastName", request.LastName),
        new MySqlParameter("@Email", request.Email),
        new MySqlParameter("@PasswordHash", BCrypt.Net.BCrypt.HashPassword(request.Password)),
        new MySqlParameter("@RoleId", 4)
    };

            await _dbHelper.ExecuteNonQueryAsync(insertQuery, parameters);

            const string getUserIdQuery = "SELECT Id FROM Users WHERE Email = @Email";
            var userId = await _dbHelper.ExecuteScalarAsync<int>(getUserIdQuery, new[] { checkEmailParams });

            if (userId == 0)
            {
                return BadRequest(new { message = "Felhasználó ID nem található!" });
            }

            const string insertStudentDetailsQuery = @"
        INSERT INTO StudentDetails 
        (UserId, PhoneNumber, DateOfBirth, BirthName, MothersName, 
         CountryOfBirth, PlaceOfBirth, Gender, Citizenship, StudentCardNumber, 
         BankAccountNumber, Country, PostalCode, City, Address, SchoolName, 
         StudyStartDate, StudyEndDate)
        VALUES 
        (@UserId, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";

            var studentDetailsParams = new MySqlParameter[] {
        new MySqlParameter("@UserId", userId)
    };

            await _dbHelper.ExecuteNonQueryAsync(insertStudentDetailsQuery, studentDetailsParams);

            return Ok(new { message = "Sikeres regisztráció!" });
        }




        //POST: bejelentkezés meglévő fiókkal - public
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            const string query = "SELECT Id, PasswordHash, RoleId, IsActive FROM Users WHERE Email = @Email";
            var parameters = new MySqlParameter[] { new MySqlParameter("@Email", request.Email) };
            var result = await _dbHelper.ExecuteQueryAsync(query, parameters);

            if (result.Rows.Count == 0)
                return Unauthorized(new { message = "Hibás felhasználónév vagy jelszó!" });

            var row = result.Rows[0];
            var userId = Convert.ToInt32(row["Id"]);
            var passwordHash = row["PasswordHash"].ToString();
            var roleId = Convert.ToInt32(row["RoleId"]);
            var isActive = Convert.ToInt32(row["IsActive"]);

            if (isActive == 0)
                return Unauthorized(new { message = "A fiók inaktív, kérjük lépjen kapcsolatba az adminisztrátorral!" });

            if (!BCrypt.Net.BCrypt.Verify(request.Password, passwordHash))
                return Unauthorized(new { message = "Hibás felhasználónév vagy jelszó!" });

            var roleMap = new Dictionary<int, string>
    {
        { 1, "Admin" },
        { 2, "Organization" },
        { 3, "Agent" },
        { 4, "User" }
    };

            var role = roleMap.GetValueOrDefault(roleId, "User");
            var token = GenerateJwtToken(userId, role, request.StayLoggedIn);

            return Ok(new { token, role });
        }


        //POST: kijelentkezés - public
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Sikeres kijelentkezés!" });
        }

        private string GenerateJwtToken(int userId, string role, bool isStayLoggedIn)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("e96e265f7322b748c3516dfba2f3e7da1337640d0e5d9cf873c13e13db30cc85"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenExpiration = isStayLoggedIn ? DateTime.UtcNow.AddYears(2) : DateTime.UtcNow.AddDays(1);

            var token = new JwtSecurityToken(
                issuer: "StudentHive",
                audience: "StudentHiveUsers",
                claims: claims,
                expires: tokenExpiration,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private bool IsValidEmail(string email)
        {
            var pattern = @"^[\w\.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }

        private bool IsValidPassword(string password)
        {
            var pattern = @"^(?=.*[A-Z])(?=.*\d).{8,15}$";
            return Regex.IsMatch(password, pattern);
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public int RoleId { get; set; }
            public string Password { get; set; }
            public bool StayLoggedIn { get; set; }
        }

        public class RegisterRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}