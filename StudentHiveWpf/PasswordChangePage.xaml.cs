using Newtonsoft.Json;
using StudentHiveWpf.Services;
using System;
using System.Windows;
using System.Windows.Controls;

namespace StudentHiveWpf
{
    public partial class PasswordChangePage : Window
    {
        private readonly ApiService _apiService;

        public PasswordChangePage()
        {
            InitializeComponent();
            _apiService = new ApiService();  // Instantiate ApiService
        }

        private async void ChangePassword_Click(object sender, RoutedEventArgs e)
        {
            string newPassword = NewPasswordInput.Text;
            string confirmPassword = ConfirmPasswordInput.Text;

            if (string.IsNullOrEmpty(newPassword) || string.IsNullOrEmpty(confirmPassword))
            {
                MessageBox.Show("Please fill out both password fields.");
                return;
            }

            if (newPassword != confirmPassword)
            {
                MessageBox.Show("Passwords do not match.");
                return;
            }

            try
            {
                int userId = 1; 
                var response = await _apiService.UpdateUserPasswordAsync(userId, newPassword);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Password updated successfully.");
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Error updating password.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred: {ex.Message}");
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
