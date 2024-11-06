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

namespace BeautySalonWpf.Pages
{
    /// <summary>
    /// Логика взаимодействия для AdminPage.xaml
    /// </summary>
    public partial class AdminPage : Page
    {
        private MainWindow _mw;
        private Admins _admin;
        public AdminPage(MainWindow mw, Admins admin)
        {
            InitializeComponent();
            _mw = mw;
            _mw.ChangeWindowSize(900, 1300);
            _admin = admin;
        }
    }
}
