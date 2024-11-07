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

namespace BeautySalonWpf.WindowDialogs
{
    /// <summary>
    /// Логика взаимодействия для RedactAdmin.xaml
    /// </summary>
    public partial class RedactAdmin : Window
    {
        private Admins _admin;
        private ListView _adminsList;
        public RedactAdmin(Admins admin,ListView adminsList)
        {
            InitializeComponent();
            _admin = admin;
            _adminsList = adminsList;
            FillFieldsWInfo();
        }

        private void CloseRedactBtn_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }
        private void FillFieldsWInfo()
        {
            FNameText.Text = _admin.Fname;
            LNameText.Text = _admin.Lname;
            PatronymicText.Text= _admin.Patronymic;
            DateBirthText.SelectedDate = _admin.dateBirth;
            PhoneText.Text = _admin.phone;
            EmailText.Text = _admin.email;
            LoginText.Text = _admin.login;
        }
    }
}
