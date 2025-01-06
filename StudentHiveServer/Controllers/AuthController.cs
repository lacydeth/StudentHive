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
                new MySqlParameter("@RoleId", 4) // Default User role
            };

            try
            {
                await _dbHelper.ExecuteNonQueryAsync(query, parameters);
                return Ok(new { message = "Registration successful" });
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return Conflict(new { message = "Email already exists" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            const string query = "SELECT Id, PasswordHash FROM Users WHERE Email = @Email";
            var parameters = new MySqlParameter[]
            {
            new MySqlParameter("@Email", request.Email)
            };

            var result = await _dbHelper.ExecuteQueryAsync(query, parameters);
            if (result.Rows.Count == 0)
                return Unauthorized(new { message = "Invalid credentials" });

            var row = result.Rows[0];
            var userId = Convert.ToInt32(row["Id"]);
            var passwordHash = row["PasswordHash"].ToString();

            if (!BCrypt.Net.BCrypt.Verify(request.Password, passwordHash))
                return Unauthorized(new { message = "Invalid credentials" });

            var token = GenerateJwtToken(userId);
            return Ok(new { token });
        }

        private string GenerateJwtToken(int userId)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("e96e265f7322b748c3516dfba2f3e7da1337640d0e5d9cf873c13e13db30cc85"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "StudentHive",
                audience: "StudentHiveUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class RegisterRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
