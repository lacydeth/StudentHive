using MaterialDesignThemes.Wpf;
using StudentHiveWpf.Models;
using StudentHiveWpf.Services;
using StudentHiveWpf.Views;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;

namespace StudentHiveWpf
{
    public partial class MainWindow : Window
    {
        public readonly ApiService _apiService;

        public MainWindow()
        {
            InitializeComponent();
            _apiService = new ApiService();
            Loaded += async (s, e) => await LoadDataAsync();
        }

        // ✅ Jogosultság ellenőrzése
        public bool IsAdmin()
        {
            if (SessionManager.Role.ToLower() != "admin")
            {
                MessageBox.Show("Nincs jogosultságod ehhez a művelethez!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return false;
            }
            return true;
        }

        // ✅ Adatok betöltése
        public async Task LoadDataAsync()
        {
            if (!IsAdmin()) return;

            try
            {
                UserListBox.ItemsSource = await _apiService.GetAllUsersAsync();
            }
            catch (Exception ex)
            {
                ShowError($"Hiba történt: {ex.Message}");
            }
        }

        // ✅ Felhasználó státuszának módosítása
        public async Task ToggleUserStatusAsync()
        {
            if (!IsAdmin()) return;

            if (UserListBox.SelectedItem is not User selectedUser) return;

            try
            {
                await _apiService.ToggleUserStatusAsync(selectedUser.Id);
                MessageBox.Show("A felhasználó státusza sikeresen frissítve!");
                await LoadDataAsync();
            }
            catch (Exception ex)
            {
                ShowError($"Hiba történt: {ex.Message}");
            }
        }

        // ✅ Felhasználó szerkesztése
        public async Task EditUserAsync()
        {
            if (!IsAdmin()) return;

            if (UserListBox.SelectedItem is User selectedUser)
            {
                new UserModifyPage(selectedUser).ShowDialog();
                await LoadDataAsync();
            }
        }

        // ✅ Jelszó módosítása
        public async Task ResetUserPasswordAsync()
        {
            if (!IsAdmin()) return;

            if (UserListBox.SelectedItem is not User selectedUser)
            {
                ShowError("Kérlek válassz egy felhasználót!");
                return;
            }

            if (MessageBox.Show("Biztos meg akarod változtatni a jelszót?", "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.No)
                return;

            string newPassword = _apiService.GenerateRandomPassword();
            try
            {
                await _apiService.ResetUserPasswordAsync(selectedUser.Id, newPassword, selectedUser.Email);
                MessageBox.Show("A jelszó sikeresen frissítve, és az új jelszót emailben elküldtük!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                ShowError($"Hiba történt a jelszó frissítésekor: {ex.Message}");
            }
        }

        // ✅ Egységes hibaüzenet metódus
        public void ShowError(string message)
        {
            MessageBox.Show(message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }

        public async void ToggleButton_Checked(object sender, RoutedEventArgs e) => await ToggleUserStatusAsync();
        public async void ToggleButton_Unchecked(object sender, RoutedEventArgs e) => await ToggleUserStatusAsync();
        public async void btnedit_Click(object sender, RoutedEventArgs e) => await EditUserAsync();
        public async void btnPassword_Click(object sender, RoutedEventArgs e) => await ResetUserPasswordAsync();
        public void btnLogout_Click(object sender, RoutedEventArgs e)
        {
            new LoginPage().Show();
            Close();
        }
        public void btnClose_Click(object sender, RoutedEventArgs e) => Close();
    }
}
