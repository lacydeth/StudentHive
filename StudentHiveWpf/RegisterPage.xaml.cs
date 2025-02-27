using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace StudentHiveWpf.Views
{
    public partial class RegisterPage : Window
    {
        private readonly HttpClient _httpClient = new HttpClient { BaseAddress = new Uri("https://localhost:7067/api/auth/") };

        public RegisterPage()
        {
            InitializeComponent();
        }

        private async void RegisterButton_Click(object sender, RoutedEventArgs e)
        {
            var request = new
            {
                FirstName = FirstNameTextBox.Text,
                LastName = LastNameTextBox.Text,
                Email = EmailTextBox.Text,
                Password = PasswordBox.Password
            };

            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync("register", content);
                var responseString = await response.Content.ReadAsStringAsync();
                Console.WriteLine(responseString);  // Log the response for debugging

                // Check if the response string is not null or empty
                if (string.IsNullOrEmpty(responseString))
                {
                    MessageBox.Show("A válasz üres vagy nem érkezett válasz az API-tól.");
                    return;
                }

                // Deserialize only if the response is not null or empty
                dynamic error = JsonConvert.DeserializeObject(responseString);

                // Check if 'message' property exists
                if (error?.message != null)
                {
                    MessageBox.Show($"Hiba: {error.message}");
                }
                else
                {
                    MessageBox.Show("Hiba történt, de a válasz nem tartalmaz üzenetet.");
                }

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Sikeres regisztráció!");
                    new LoginPage().Show();
                    this.Close();
                }

            }
            catch (JsonException ex)
            {
                MessageBox.Show($"JSON hiba: {ex.Message}");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}");
            }
        }



        private void BackButton_Click(object sender, RoutedEventArgs e)
        {
            new LoginPage().Show();
            this.Close();
        }
    }
}
