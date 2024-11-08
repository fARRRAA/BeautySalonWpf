using HandyControl.Controls;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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

namespace BeautySalonWpf.WindowDialogs.Admin
{
    /// <summary>
    /// Логика взаимодействия для AddAdmin.xaml
    /// </summary>
    public partial class AddAdmin : System.Windows.Window
    {
        private ListView _adminsList;
        public AddAdmin(ListView adminslist)
        {
            InitializeComponent();
            _adminsList = adminslist;
        }

        private void CloseAddBtn_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private async void ConfirmAddBtn_Click(object sender, RoutedEventArgs e)
        {
            var inputs = new[]
               {
        LoginText.Text,
        FNameText.Text,
        LNameText.Text,
        PhoneText.Text,
        EmailText.Text,
        PasswordText.Password
                };

            if (inputs.Any(string.IsNullOrWhiteSpace) || !DateBirthText.SelectedDate.HasValue)
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }

            var admin = await ConnectionDb.db.Admins.FirstOrDefaultAsync(a => a.login == LoginText.Text);
            if (admin != null)
            {
                Growl.Error("Админ с таким логином существует.");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var temp = new Admins()
            {
                Fname = FNameText.Text,
                Lname = LNameText.Text,
                email = EmailText.Text,
                password = PasswordText.Password,
                dateBirth = DateBirthText.SelectedDate,
                phone = PhoneText.Text,
                login = LoginText.Text
            };
            ConnectionDb.db.Admins.Add(temp);
            ConnectionDb.db.SaveChanges();
            Growl.Success("Добавление прошло успешно");
            await Task.Delay(1000);
            Growl.Clear();
            _adminsList.ItemsSource = await ConnectionDb.db.Admins.ToListAsync();
            this.Close();
        }
    }
}
