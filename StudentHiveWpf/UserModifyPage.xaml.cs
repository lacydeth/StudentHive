using StudentHiveWpf.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace StudentHiveWpf
{
    /// <summary>
    /// Interaction logic for UserModifyPage.xaml
    /// </summary>
    public partial class UserModifyPage : Window
    {
        public UserModifyPage(User user)
        {
            InitializeComponent();

            FirstNameInput.Text = user.FirstName;    // Editable
            LastNameInput.Text = user.LastName;      // Editable
            EmailInput.Text = user.Email;            // Editable
            IdInput.Text = user.Id.ToString();       // Read-only
            RoleIdInput.Text = user.RoleId.ToString(); // Read-only
            OrganizationIdInput.Text = user.OrganizationId.ToString(); // Read-only
            CreatedAtInput.Text = user.CreatedAt.ToString();  // Read-only
            IsActiveInput.Text = user.IsActive.ToString(); // Read-only
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            var result = MessageBox.Show("Biztos be akarod zárni az oldalt?", "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (result == MessageBoxResult.Yes)
            {
                this.Close();
            }
        }

        private void UpdateProfile(object sender, RoutedEventArgs e)
        {

        }
    }
}
