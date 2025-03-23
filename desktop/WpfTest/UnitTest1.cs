using Newtonsoft.Json;
using StudentHiveWpf.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace StudentHiveWpf.Tests
{
    public class ApiServiceTests
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseApiUrl = "https://localhost:7067/api/general/";

        public ApiServiceTests()
        {
            _httpClient = new HttpClient();
        }

        // ✅ Test: Get All Users from the API
        [Fact]
        public async Task GetAllUsersAsync_ShouldReturnUsers()
        {
            var response = await _httpClient.GetAsync($"{_baseApiUrl}alluser");
            response.EnsureSuccessStatusCode();
            var jsonResponse = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<List<User>>(jsonResponse);
            Assert.NotNull(users);
            Assert.True(users.Count > 0);
        }

        // ✅ Test: Get Users When No Users Exist
        [Fact]
        public async Task GetAllUsersAsync_ShouldReturnNonEmptyList_WhenUsersExist()
        {
            // Arrange
            var response = await _httpClient.GetAsync($"{_baseApiUrl}alluser");

            // Assert
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<List<User>>(jsonResponse);

            // Ha mindig kell lennie felhasználónak, akkor ezt ellenőrizd:
            Assert.NotNull(users);
            Assert.True(users.Count > 0);  // Elvárjuk, hogy legyenek felhasználók
        }

        // ✅ Test: Toggle User Status
        [Fact]
        public async Task ToggleUserStatusAsync_ShouldReturnSuccess_WhenUserExists()
        {
            int userId = 1;
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-status/{userId}", null);
            response.EnsureSuccessStatusCode();
        }

        // ✅ Test: Toggle Status for Non-Existent User
        [Fact]
        public async Task ToggleUserStatusAsync_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            int userId = 9999;
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-status/{userId}", null);
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        // ✅ Test: Update User Password
        [Fact]
        public async Task UpdateUserPasswordAsync_ShouldReturnSuccess_WhenPasswordUpdated()
        {
            int userId = 1;
            var newPassword = "newSecurePassword123";
            var requestBody = new { NewPassword = newPassword };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-password/{userId}", content);
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task UpdateUserPasswordAsync_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            int nonExistentUserId = 99999; // Feltételezzük, hogy ez az ID nem létezik
            var newPassword = "NewSecurePassword123!";

            var requestBody = new { NewPassword = newPassword };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");

            // Act
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-password/{nonExistentUserId}", content);

            // Assert: Az API-nak vissza kell adnia a 404-es hibakódot
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        // ✅ Test: Toggle User Status Should Return Response Within Expected Time
        [Fact]
        public async Task ToggleUserStatusAsync_ShouldReturnResponseWithinExpectedTime()
        {
            int existingUserId = 1; // Feltételezzük, hogy a 1-es ID-vel rendelkező felhasználó létezik

            // Mérjük a válaszidőt
            var startTime = DateTime.Now;
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-status/{existingUserId}", null);
            var endTime = DateTime.Now;

            // Számítsuk ki a válaszidőt másodpercekben
            var responseTime = (endTime - startTime).TotalSeconds;

            // Ellenőrizzük, hogy a válaszidő nem haladja meg az 1 másodpercet
            Assert.True(responseTime < 1, $"A válaszidő túl hosszú: {responseTime} másodperc.");
        }



        // ✅ Test: Update User Profile
        [Fact]
        public async Task UpdateUserProfileAsync_ShouldReturnSuccess_WhenProfileUpdated()
        {
            int userId = 1;
            string firstName = "John";
            string lastName = "Doe";
            string email = "john.doe@example.com";
            var requestBody = new { FirstName = firstName, LastName = lastName, Email = email };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-profile/{userId}", content);
            response.EnsureSuccessStatusCode();
        }

        // ✅ Paraméterezett teszt: Több különböző felhasználó adatainak módosítása
        [Theory]
        [InlineData(1, "John", "Doe", "john.doe@example.com")]
        [InlineData(2, "Jane", "Smith", "jane.smith@example.com")]
        public async Task UpdateUserProfileAsync_ShouldReturnSuccess_ForDifferentUsers(int userId, string firstName, string lastName, string email)
        {
            var requestBody = new { FirstName = firstName, LastName = lastName, Email = email };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-profile/{userId}", content);
            response.EnsureSuccessStatusCode();
        }
    }
}
