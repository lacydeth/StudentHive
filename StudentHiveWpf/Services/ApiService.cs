using Newtonsoft.Json;
using StudentHiveWpf.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
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

        public async Task<HttpResponseMessage> UpdateUserProfileAsync(int userId, string firstName, string lastName, string email)
        {
            var requestBody = new
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"update-user-profile/{userId}", content);

            return response;
        }

        public async Task ResetUserPasswordAsync(int userId, string newPassword, string userEmail)
{
    var requestBody = new { NewPassword = newPassword };
    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

    var response = await _httpClient.PatchAsync($"update-user-password/{userId}", content);

    if (!response.IsSuccessStatusCode)
        throw new Exception($"Hiba történt a jelszó frissítésekor: {response.StatusCode}");

    SendEmail(userEmail, $"A jelszavad helyre lett állítva. Itt az új jelszó: {newPassword}", "StudentHive");
}


        private void SendEmail(string toEmail, string emailBody, string name)
        {
            try
            {
                using (var client = new SmtpClient())
                {
                    client.Host = "smtp.gmail.com";
                    client.Port = 587;
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.UseDefaultCredentials = false;
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential("info.studenthive@gmail.com", "nuccijdmnyurqzel");

                    using (var mailMessage = new MailMessage(
                        from: new MailAddress("info.studenthive@gmail.com", "StudentHive"),
                        to: new MailAddress(toEmail, name)))
                    {
                        mailMessage.Subject = "Új jelszó";
                        mailMessage.Body = emailBody;
                        mailMessage.IsBodyHtml = false;
                            
                        client.Send(mailMessage);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        }

        public string GenerateRandomPassword(int length = 12)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
            var random = new Random();
            var password = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                password.Append(validChars[random.Next(validChars.Length)]);
            }

            return password.ToString();
        }

    }
}
