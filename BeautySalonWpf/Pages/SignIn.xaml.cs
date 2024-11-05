using HandyControl.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
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
            Growl.Success("Вы успешно вошли в систему");
            await Task.Delay(1500);
            _mw.MainFrame.NavigationService.Navigate(new SignUp(_mw));
        }

        private void notRegistered_Click(object sender, RoutedEventArgs e)
        {
            _mw.MainFrame.NavigationService.Navigate(new SignUp(_mw));

        }
    }
}
