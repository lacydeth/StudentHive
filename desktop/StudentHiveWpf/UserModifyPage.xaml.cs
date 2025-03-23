using Newtonsoft.Json;
using StudentHiveWpf.Models;
using StudentHiveWpf.Services;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace StudentHiveWpf
{
    public partial class UserModifyPage : Window
    {
        private readonly HttpClient _httpClient;
        private readonly int _userId;

        public UserModifyPage(User user)
        {
            InitializeComponent();
            _httpClient = new HttpClient { BaseAddress = new Uri("https://localhost:7067/api/general/") };
            _userId = user.Id;

            FirstNameInput.Text = user.FirstName;
            LastNameInput.Text = user.LastName;
            EmailInput.Text = user.Email;
            IdInput.Text = user.Id.ToString();
            RoleIdInput.Text = user.RoleId.ToString();
            OrganizationIdInput.Text = user.OrganizationId.ToString();
            CreatedAtInput.Text = user.CreatedAt.ToString();
            IsActiveInput.Text = user.IsActive.ToString();
        }

        private async void UpdateProfile(object sender, RoutedEventArgs e)
        {
            if (SessionManager.Role.ToLower() != "admin")
            {
                MessageBox.Show("Nincs jogosultságod ehhez a művelethez!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var apiService = new ApiService();

            try
            {
                var response = await apiService.UpdateUserProfileAsync(
                    _userId,
                    FirstNameInput.Text,
                    LastNameInput.Text,
                    EmailInput.Text
                );

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Profil sikeresen frissítve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Hiba történt a frissítés során.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hálózati hiba: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }


        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            var result = MessageBox.Show("Biztos be akarod zárni az oldalt?", "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (result == MessageBoxResult.Yes)
            {
                this.Close();
            }
        }
    }
}
