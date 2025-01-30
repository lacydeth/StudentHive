﻿using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
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
                    j.Id,
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
                    Id = row.Field<int>("Id"),
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

        // GET: Single work card by ID
        [HttpGet("workcards/{id}")]
        public async Task<IActionResult> GetWorkCardById(int id)
        {
            const string query = @"SELECT 
                                    j.Id,
                                    j.Title, 
                                    j.HourlyRate, 
                                    j.City,
                                    j.Address,
                                    c.CategoryName, 
                                    c.ImagePath,
                                    d.OurOffer,
                                    d.MainTaks,
                                    d.JobRequirements,
                                    d.Advantages
                                FROM Jobs j
                                JOIN Categories c ON j.CategoryId = c.Id
                                LEFT JOIN Description d ON j.DescriptionId = d.Id
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

                var workCard = new
                {
                    Id = row.Field<int>("Id"),
                    Title = row.Field<string>("Title"),
                    Salary = row.Field<int>("HourlyRate").ToString("N0") + " Ft/óra",
                    City = row.Field<string>("City"),
                    Address = row.Field<string>("Address"),
                    Category = row.Field<string>("CategoryName"),
                    Image = row.Field<string>("ImagePath"),
                    OurOffer = row.Field<string?>("OurOffer") ?? "",
                    MainTasks = row.Field<string?>("MainTaks") ?? "",
                    JobRequirements = row.Field<string?>("JobRequirements") ?? "",
                    Advantages = row.Field<string?>("Advantages") ?? ""
                };

                return Ok(workCard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a munka lekérdezése közben.", details = ex.Message });
            }
        }
    }
}
