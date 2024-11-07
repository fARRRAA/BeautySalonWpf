using BeautySalonWpf.WindowDialogs;
using HandyControl.Controls;
using HandyControl.Properties.Langs;
using HandyControl.Tools;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace BeautySalonWpf.Pages.Admin
{
    /// <summary>
    /// Логика взаимодействия для AdminPage.xaml
    /// </summary>

    public partial class AdminPage : Page
    {
        private MainWindow _mw;
        private Admins _admin;
        private List<Admins> _admins;
        private int pageCount;
        private int pageSize=9;
        public AdminPage(MainWindow mw, Admins admin)
        {
            InitializeComponent();
            _mw = mw;
            _mw.ChangeWindowSize(900, 1400);
            _admin = admin;
            var admins = ConnectionDb.db.Admins.ToList();
            AdminsList.ItemsSource = admins.Take(9);
            _admins = admins;
            pageCount=(int)Math.Round(Convert.ToDouble(_admins.Count / 9)) + 1;
            paginationElem.MaxPageCount = pageCount;
            AdminsCountText.Content = $"Всего администраторов: {_admins.Count}";
        }

        private void AdminsSearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            var searchtext = AdminsSearchText.Text.ToLower();
            var filtered = _admins.Where(a=>a.Lname.ToLower().Contains(searchtext)
            ||a.Fname.ToLower().Contains(searchtext)
            ||a.Patronymic.ToLower().Contains(searchtext)
            ||a.login.ToLower().Contains(searchtext)
            ||a.email.ToLower().Contains(searchtext)
            ).ToList();
            AdminsList.ItemsSource = filtered;
        }
        private void page_PageUpdated(object sender, HandyControl.Data.FunctionEventArgs<int> e)
        {
            AdminsList.ItemsSource = _admins.Skip((e.Info - 1) * pageSize).Take(pageSize).ToList();
        }

        private async  void deleteAdmin_Click(object sender, RoutedEventArgs e)
        {
            if (AdminsList.SelectedItem == null)
            {
                Growl.Error("Выберите админа!");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var selectedAdmin = AdminsList.SelectedItem as Admins;

            ConnectionDb.db.Admins.Remove(selectedAdmin);
            ConnectionDb.db.SaveChanges();
            var admins = ConnectionDb.db.Admins.ToList();
            AdminsList.ItemsSource = admins.Take(9);
            Growl.Success("Удаление прошло успешно");
           await Task.Delay(1500);
            Growl.Clear();
        }

        private async void redactAdmin_Click(object sender, RoutedEventArgs e)
        {
            if (AdminsList.SelectedItem == null)
            {
                Growl.Error("Выберите админа!");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var adminRedact = new RedactAdmin(_admin, AdminsList);
            adminRedact.Show();
        }
    }
}
