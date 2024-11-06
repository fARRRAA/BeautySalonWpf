using HandyControl.Controls;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Xml.Linq;

namespace BeautySalonWpf.Pages
{
    /// <summary>
    /// Логика взаимодействия для SignIn.xaml
    /// </summary>
    public partial class SignIn : Page
    {
        private MainWindow _mw;
        public SignIn(MainWindow mw)
        {
            InitializeComponent();
            _mw = mw;
            _mw.ChangeWindowSize(600, 700);
        }



        private async void LoginBtn_Click(object sender, RoutedEventArgs e)
        {
            var login = LoginTextUser.Text;
            var password = PasswordTextUser.Password;
            var temp = new Users()
            {
                login = login,
                password = password,
            };
            if (string.IsNullOrWhiteSpace(login) || string.IsNullOrWhiteSpace(password))
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var check = await ConnectionDb.db.Users.FirstOrDefaultAsync(x=>x.login == login&&x.password==password);
            if(check == null){
                Growl.Error("Неправильный логин или пароль");
                return;
            }

            Growl.Success("Вы успешно вошли в систему");
            await Task.Delay(1500);
            Growl.Clear();
            _mw.MainFrame.NavigationService.Navigate(new SignUp(_mw));
        }

        private void notRegistered_Click(object sender, RoutedEventArgs e)
        {
            _mw.MainFrame.NavigationService.Navigate(new SignUp(_mw));

        }

        private async void LoginBtnAdmin_Click(object sender, RoutedEventArgs e)
        {
            var login = LoginTextAdmin.Text;
            var password = PasswordTextAdmin.Password;
            var temp = new Admins()
            {
                login = login,
                password = password,
            };
            if (string.IsNullOrWhiteSpace(login) || string.IsNullOrWhiteSpace(password))
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var check = await ConnectionDb.db.Admins.FirstOrDefaultAsync(x => x.login == login && x.password == password);
            if (check == null)
            {
                Growl.Error("Неправильный логин или пароль");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }

            Growl.Success("Вы успешно вошли в систему");
            await Task.Delay(1500);
            Growl.Clear();
            _mw.MainFrame.NavigationService.Navigate(new AdminPage(_mw,check));
        }

        private void LoginBtnMaster_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
