using Newtonsoft.Json;
using StudentHiveWpf.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace StudentHiveWpf.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;

        public ApiService()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://localhost:7067/api/general/");
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            var response = await _httpClient.GetAsync("alluser");

            if (!response.IsSuccessStatusCode)
                throw new Exception($"API hiba: {response.StatusCode}");

            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<User>>(json);
        }

        public async Task ToggleUserStatusAsync(int userId)
        {
            var response = await _httpClient.PatchAsync($"update-user-status/{userId}", null);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Hiba történt a felhasználó státuszának frissítésekor: {response.StatusCode}");
        }

        public async Task<HttpResponseMessage> UpdateUserPasswordAsync(int userId, string newPassword)
        {
            var requestBody = new { NewPassword = newPassword };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"update-user-password/{userId}", content);

            return response;
        }



    }
}
