using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace StudentHiveWpf.Views
{
    public partial class LoginPage : Window
    {
        private readonly HttpClient _httpClient = new HttpClient { BaseAddress = new Uri("https://localhost:7067/api/auth/") };

        public LoginPage()
        {
            InitializeComponent();
        }

        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            var request = new
            {
                Email = EmailTextBox.Text,
                Password = PasswordBox.Password,
                StayLoggedIn = StayLoggedInCheckBox.IsChecked ?? false
            };

            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync("login", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    dynamic result = JsonConvert.DeserializeObject(responseString);
                    string token = result.token;
                    string role = result.role;

                    new MainWindow().Show();


                    MessageBox.Show($"Sikeres bejelentkezés!\nSzerepkör: {role}");
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Hibás email vagy jelszó!");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}");
            }
        }

        private void RegisterButton_Click(object sender, RoutedEventArgs e)
        {
            new RegisterPage().Show(); // Open the registration page
            this.Close();
        }
    }
}
