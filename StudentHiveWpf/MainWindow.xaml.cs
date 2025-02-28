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
            if (UserListBox.SelectedItem is User selectedUser)
            {
                try
                {
                    // Frissítjük a felhasználó állapotát
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
            if (UserListBox.SelectedItem is User selectedUser)
            {
                try
                {
                    // Frissítjük a felhasználó állapotát
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
        private void btnedit_Click(object sender, RoutedEventArgs e)
        {
            var selectedUser = UserListBox.SelectedItem as User;

            if (selectedUser != null)
            {
                UserModifyPage modifyPage = new UserModifyPage(selectedUser);
                modifyPage.ShowDialog();  
            }
        }

        private void btnPassword_Click(object sender, RoutedEventArgs e)
        {
            PasswordChangePage passwordChangePage = new PasswordChangePage();
            passwordChangePage.Show();
        }

    }
}
