using BeautySalonWpf.Pages.Admin.Tabs;
using BeautySalonWpf.WindowDialogs;
using BeautySalonWpf.WindowDialogs.Admin;
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
        private List<string> choosedTypes=new List<string>();
        public AdminPage(MainWindow mw, Admins admin)
        {
            InitializeComponent();
            _mw = mw;
            _mw.ChangeWindowSize(900, 1400);
            _admin = admin;
            AdminTabFrame.Navigate(new AdminTab(_admin));
            MastersTabFrame.Navigate(new MastersTab( _admin));
            ClientsTabFrame.Navigate(new ClientsTab( _admin));
            ProductsFrame.Navigate(new ProductsTab( _admin));   
        }

        public void MasterStartSettings()
        {

        }
    }
}
