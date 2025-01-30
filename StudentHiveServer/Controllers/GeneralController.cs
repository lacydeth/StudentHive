using Microsoft.AspNetCore.Mvc;
using StudentHiveServer.Utils;
using System.Data;

namespace StudentHiveServer.Controllers
{
    [ApiController]
    [Route("api/general")]
    public class GeneralController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public GeneralController(IConfiguration configuration)
        {
            _dbHelper = new DatabaseHelper(configuration.GetConnectionString("DefaultConnection"));
        }

        // GET: All available work cards
        [HttpGet("workcards")]
        public async Task<IActionResult> GetWorkCards()
        {
            const string query = @"
                SELECT 
                    j.Title, 
                    j.HourlyRate, 
                    j.City, 
                    c.CategoryName, 
                    c.ImagePath 
                FROM Jobs j
                JOIN Categories c ON j.CategoryId = c.Id
                WHERE j.IsActive = 1
                ORDER BY j.CreatedAt DESC";

            try
            {
                var dataTable = await _dbHelper.ExecuteQueryAsync(query);
                var workCards = dataTable.AsEnumerable().Select(row => new
                {
                    Title = row.Field<string>("Title"),
                    Salary = row.Field<int>("HourlyRate").ToString("N0") + " Ft/óra",
                    Location = row.Field<string>("City"),
                    Category = row.Field<string>("CategoryName"),
                    Image = row.Field<string>("ImagePath")
                }).ToList();

                return Ok(workCards);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a munkák lekérdezése közben.", details = ex.Message });
            }
        }
    }
}
