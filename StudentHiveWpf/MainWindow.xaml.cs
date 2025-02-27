using StudentHiveWpf.Models;
using StudentHiveWpf.Services;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace StudentHiveWpf
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly ApiService _apiService;
        public MainWindow()
        {
            InitializeComponent();
            _apiService = new ApiService();
        }

        private async void LoadUsers_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                List<User> users = await _apiService.GetAllUsersAsync();
                foreach (var item in users)
                {
                UserListBox.ItemsSource = users;

                    Console.WriteLine(item);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message);
            }
        }
    }
}