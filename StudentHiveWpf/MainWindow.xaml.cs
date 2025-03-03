using MaterialDesignThemes.Wpf;
using StudentHiveWpf.Models;
using StudentHiveWpf.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media.Imaging;


namespace StudentHiveWpf
{
    public partial class MainWindow : Window
    {
        private readonly ApiService _apiService;

        public MainWindow()
        {
            InitializeComponent();
            _apiService = new ApiService();
            Loaded += MainWindow_Loaded;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            await LoadDataAsync(); 
        }

        private async Task LoadDataAsync()
        {
            if (SessionManager.Role.ToLower() != "admin")
            {
                MessageBox.Show("Nincs jogosultságod ehhez a művelethez!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                List<User> users = await _apiService.GetAllUsersAsync();
                UserListBox.ItemsSource = users;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message);
            }
        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        

        private async void ToggleButton_Checked(object sender, RoutedEventArgs e)
        {
            if (SessionManager.Role.ToLower() != "admin")
            {
                MessageBox.Show("Nincs jogosultságod ehhez a művelethez!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (UserListBox.SelectedItem is User selectedUser)
            {
                try
                {
                    await _apiService.ToggleUserStatusAsync(selectedUser.Id);
                    MessageBox.Show($"A felhasználó státusza sikeresen frissítve!");
                    await LoadDataAsync();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Hiba történt: " + ex.Message);
                }
            }
        }

        private async void ToggleButton_Unchecked(object sender, RoutedEventArgs e)
        {
            if (SessionManager.Role.ToLower() != "admin")
            {
                MessageBox.Show("Nincs jogosultságod ehhez a művelethez!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (UserListBox.SelectedItem is User selectedUser)
            {
                try
                {
                    await _apiService.ToggleUserStatusAsync(selectedUser.Id);
                    MessageBox.Show($"A felhasználó státusza sikeresen frissítve!");
                    await LoadDataAsync();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Hiba történt: " + ex.Message);
                }
            }
        }
        private async void btnedit_Click(object sender, RoutedEventArgs e)
        {
            if (SessionManager.Role.ToLower() != "admin")
            {
                MessageBox.Show("Nincs jogosultságod ehhez a művelethez!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var selectedUser = UserListBox.SelectedItem as User;

            if (selectedUser != null)
            {
                UserModifyPage modifyPage = new UserModifyPage(selectedUser);
                modifyPage.ShowDialog(); 

                await LoadDataAsync();
            }
        }


        private async void btnPassword_Click(object sender, RoutedEventArgs e)
        {
            if (SessionManager.Role.ToLower() != "admin")
            {
                MessageBox.Show("Nincs jogosultságod ehhez a művelethez!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

          
            var selectedUser = UserListBox.SelectedItem as User;
            if (selectedUser == null)
            {
                MessageBox.Show("Kérlek válassz egy felhasználót!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

         
            var result = MessageBox.Show("Biztos meg akarod változtatni a jelszót?", "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Question);

            if (result == MessageBoxResult.No)
            {
                return; 
            }

          
            string newPassword = _apiService.GenerateRandomPassword();
            string confirmPassword = newPassword; 

            if (string.IsNullOrEmpty(confirmPassword))
            {
                MessageBox.Show("Please confirm the new password.");
                return;
            }

            if (newPassword != confirmPassword)
            {
                MessageBox.Show("Passwords do not match.");
                return;
            }

            try
            {
                int userId = selectedUser.Id; 
                string userEmail = selectedUser.Email;

                await _apiService.ResetUserPasswordAsync(userId, newPassword, userEmail);

                MessageBox.Show("A jelszó sikeresen frissítve, és az új jelszót emailben elküldtük!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt a jelszó frissítésekor: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }


    }
}
