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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace BeautySalonWpf.Pages.Admin.Tabs
{
    /// <summary>
    /// Логика взаимодействия для MastersTab.xaml
    /// </summary>
    public partial class MastersTab : Page
    {
        private MainWindow _mw;
        private Admins _admin;
        private List<Masters> _masters;
        private int pageCount;
        private int pageSize = 9;
        public MastersTab(MainWindow mw,Admins admin)
        {
            InitializeComponent();
            _mw = mw;
            _admin = admin;
            _masters = ConnectionDb.db.Masters.ToList();
            MastersList.ItemsSource = _masters;
            pageCount = (int)Math.Round(Convert.ToDouble(_masters.Count / 9)) + 1;
            paginationElem.MaxPageCount = pageCount;
            MastersCountText.Content = $"Всего администраторов: {_masters.Count}";
        }

        private void MastersSearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            var searchText = MastersSearchText.Text.ToLower();
            var filtered = _masters.Where(a => a.Lname.ToLower().Contains(searchText)
            || a.Fname.ToLower().Contains(searchText)
            || a.MastersQualifications.TypeServices.name.ToLower().Contains(searchText)
            || a.login.ToLower().Contains(searchText)
            || a.email.ToLower().Contains(searchText)
            || a.MastersSkills.name.ToLower().Contains(searchText)
            ).ToList();
            MastersList.ItemsSource = filtered;
        }

        private void deleteMaster_Click(object sender, RoutedEventArgs e)
        {

        }

        private void redactMaster_Click(object sender, RoutedEventArgs e)
        {

        }

        private void addMaster_Click(object sender, RoutedEventArgs e)
        {

        }
        private void page_PageUpdated(object sender, HandyControl.Data.FunctionEventArgs<int> e)
        {
            MastersList.ItemsSource = _masters.Skip((e.Info - 1) * pageSize).Take(pageSize).ToList();
        }
    }
}
