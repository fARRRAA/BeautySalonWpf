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
using System.Windows.Media.Media3D;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace BeautySalonWpf.Pages.Master
{
    /// <summary>
    /// Логика взаимодействия для MasterPage.xaml
    /// </summary>
    public partial class MasterPage : Page
    {
        private Masters _master;
        private MainWindow _mw;
        public MasterPage(MainWindow mw, Masters master)
        {
            InitializeComponent();
            _mw = mw;
            _mw.ChangeWindowSize(950, 1450);



            ClientsTabFrame.Navigate(new ClientPage());
            ServicesTabFrame.Navigate(new MasterServicesTab(master));
            ProductsFrame.Navigate(new MaterialsTab(master));
            AppointmentsFrame.Navigate(new MasterAppointments(master));
            SalaryFrame.Navigate(new SalaryPage(master));

            MasterFnameText.Text = master.Fname;
            MasterLnameText.Text = master.Lname;
            MasterEmailText.Text = master.email;
            MasterPatronymicText.Text = master.Patronymic;
            MasterSkillText.Text = master.MastersSkills.name;
            MasterPhoneText.Text = master.phone;
            MasterQualificationText.Text = master.MastersQualifications.TypeServices.name;
            _master = master;


            var allAppointments = ConnectionDb.db.Appointments.ToList();
            var countAppointments = ConnectionDb.db.Appointments.Count(a => a.masterId == _master.masterId);
            AllAppointmentsText.Content = countAppointments;
            var appointmentsInMonth = allAppointments.Count(a => a.date.Value.Month == DateTime.Now.Month && a.masterId == master.masterId);
            MonthAppoinmentsText.Content = appointmentsInMonth;
            var salary = ConnectionDb.db.MastersSalaries.FirstOrDefault(a => a.masterId == _master.masterId && a.year == DateTime.Now.Year && a.month == DateTime.Now.Month);
            //SalatyText.Content = $"{salary.salary} ₽";
        }

        private async void QuitBtn_Click(object sender, RoutedEventArgs e)
        {
            await Task.Delay(250);
            _mw.MainFrame.Navigate(new SignIn(_mw));
        }

    }
}
