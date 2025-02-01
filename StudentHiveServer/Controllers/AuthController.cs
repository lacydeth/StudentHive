using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            const string query = "INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId) VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId)";
            var parameters = new MySqlParameter[]
            {
                new MySqlParameter("@FirstName", request.FirstName),
                new MySqlParameter("@LastName", request.LastName),
                new MySqlParameter("@Email", request.Email),
                new MySqlParameter("@PasswordHash", BCrypt.Net.BCrypt.HashPassword(request.Password)),
                new MySqlParameter("@RoleId", 4) 
            };

            try
            {
                await _dbHelper.ExecuteNonQueryAsync(query, parameters);
                return Ok(new { message = "Sikeres regisztráció!" });
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return Conflict(new { message = "Ez az emailcím már foglalt!" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            const string query = "SELECT Id, PasswordHash, RoleId FROM Users WHERE Email = @Email";
            var parameters = new MySqlParameter[] { new MySqlParameter("@Email", request.Email) };

            var result = await _dbHelper.ExecuteQueryAsync(query, parameters);
            if (result.Rows.Count == 0)
                return Unauthorized(new { message = "Hibás felhasználónév vagy jelszó!" });

            var row = result.Rows[0];
            var userId = Convert.ToInt32(row["Id"]);
            var passwordHash = row["PasswordHash"].ToString();
            var roleId = Convert.ToInt32(row["RoleId"]);

            if (!BCrypt.Net.BCrypt.Verify(request.Password, passwordHash))
                return Unauthorized(new { message = "Hibás felhasználónév vagy jelszó!" });

            var token = GenerateJwtToken(userId, roleId == 1 ? "Admin" : roleId == 2 ? "Organization" : "User", request.StayLoggedIn);
            return Ok(new { token, role = roleId == 1 ? "Admin" : roleId == 2 ? "Organization" : "User" });
        }

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

        public class LoginRequest
        {
            public string Email { get; set; }
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