using BeautySalonWpf.WindowDialogs.AdminPage.Appointments;
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
    /// Логика взаимодействия для AppointmentsTab.xaml
    /// </summary>
    public partial class AppointmentsTab : Page
    {
        public AppointmentsTab()
        {
            InitializeComponent();
        }

        private void deleteAppointment_Click(object sender, RoutedEventArgs e)
        {

        }

        private void addAppointment_Click(object sender, RoutedEventArgs e)
        {
            var addAppointmentDialog = new AddAppointment(this);
            addAppointmentDialog.Show();
        }
    }
}
