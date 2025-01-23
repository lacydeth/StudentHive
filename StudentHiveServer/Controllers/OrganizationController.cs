using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StudentHiveServer.Utils;
using System.Security.Claims;
using System.Text.Json;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/organization")]
    public class OrganizationController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public OrganizationController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }

        // POST: Create new agent
        [HttpPost("new-agent")]
        public async Task<IActionResult> AddAgent([FromBody] NewAgentRequest request)
        {
            // Get the logged-in user's ID from the token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier); // JWT Claim for user ID
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var loggedInUserId = userIdClaim.Value; // This is the user ID from the token

            // Generate password for new agent
            var plainPassword = GenerateRandomPassword();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);

            try
            {
                // Insert the new agent into the database
                const string insertQuery = @"INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, OrganizationId) 
                                            VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId, @OrganizationId)";
                var insertParameters = new MySqlParameter[]
                {
                    new MySqlParameter("@FirstName", request.FirstName),
                    new MySqlParameter("@LastName", request.LastName),
                    new MySqlParameter("@Email", request.NewAgentEmail),
                    new MySqlParameter("@PasswordHash", hashedPassword),
                    new MySqlParameter("@RoleId", 3), // RoleId 3 = Agent
                    new MySqlParameter("@OrganizationId", loggedInUserId) // Use the logged-in user ID for organization
                };

                await _dbHelper.ExecuteNonQueryAsync(insertQuery, insertParameters);

                return Ok(new { message = "Agent added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the agent.", details = ex.Message });
            }
        }

        private static string GenerateRandomPassword(int length = 10)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var password = new char[length];
            for (var i = 0; i < length; i++)
            {
                password[i] = chars[random.Next(chars.Length)];
            }
            return new string(password);
        }

        public class NewAgentRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string NewAgentEmail { get; set; }
        }
    }
}
