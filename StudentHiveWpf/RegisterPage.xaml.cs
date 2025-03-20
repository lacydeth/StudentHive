using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace StudentHiveWpf
{
    /// <summary>
    /// Interaction logic for RegisterPage.xaml
    /// </summary>
    public partial class RegisterPage : Window
    {
        private readonly HttpClient _httpClient;
        private const string ApiBaseUrl = "https://localhost:7067/api/auth";

        public RegisterPage()
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("X-Client-Id", "StudentHiveWpfClient");
            _httpClient.DefaultRequestHeaders.Add("X-Api-Key", "e96e265f7322b748c3516dfba2f3e7da1337640d0e5d9cf873c13e13db30cc85"); // Replace with a secure API key
        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            await RegisterAdmin();
        }

        private async Task RegisterAdmin()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(EmailTextBox.Text))
                {
                    MessageBox.Show("Az email cím megadása kötelező!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                if (string.IsNullOrWhiteSpace(PasswordBox.Password))
                {
                    MessageBox.Show("A jelszó megadása kötelező!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                var registerRequest = new RegisterRequest
                {
                    FirstName = "Admin",
                    LastName = "User",
                    Email = EmailTextBox.Text,
                    Password = PasswordBox.Password
                };

                var jsonContent = JsonSerializer.Serialize(registerRequest);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{ApiBaseUrl}/register-admin", content);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Sikeres regisztráció!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    this.Close();
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(errorContent);
                    MessageBox.Show(errorResponse?.Message ?? "Sikertelen regisztráció!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }

    public class RegisterRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ErrorResponse
    {
        public string Message { get; set; }
    }
}