using BeautySalonWpf.Pages.Admin.Tabs;
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

namespace BeautySalonWpf.WindowDialogs.AdminPage.Appointmentdialogs
{
    /// <summary>
    /// Логика взаимодействия для AddAppointmentDialog.xaml
    /// </summary>

    public partial class AddAppointmentDialog : System.Windows.Window
    {
        private AppointmentsTab _owner;
        private List<Clients> _clients;
        private List<Masters> _masters;
        private List<ServiceSkill> _allServices = new List<ServiceSkill>();
        private List<ServiceSkill> _services;

        private Clients _selectedClient;
        private Masters _selectedMaster;
        private List<ServiceSkill> _selectedServices = new List<ServiceSkill>();
        private List<Appointments> _appointments;
        private TimeSpan? selectedTime;
        private DateTime? selectedDate;

        int prevTabIndex = 0;
        public AddAppointmentDialog(AppointmentsTab owner)
        {
            InitializeComponent();
            _owner = owner;
            ClientTabLoad();
            MastersTabLoad();

        }


        private void ClientsSearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            var searchText = ClientsSearchText.Text.ToLower();
            var filtered = _clients.Where(a => a.Lname.ToLower().Contains(searchText)
            || a.FName.ToLower().Contains(searchText)
            || a.login.ToLower().Contains(searchText)
            || a.email.ToLower().Contains(searchText)
            ).ToList();
            ClientsList.ItemsSource = filtered;
        }
        public void ClientTabLoad()
        {
            _clients = ConnectionDb.db.Clients.ToList();
            ClientsList.ItemsSource = _clients;

        }
        private void ClientsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var selectedClient = ClientsList.SelectedItem as Clients;
            _selectedClient = selectedClient;
            if (selectedClient != null)
            {
                ClientFnameText.Text = selectedClient.FName;
                ClientLnameText.Text = selectedClient.Lname;
                ClientPhoneText.Text = selectedClient.phone;
                ClientEmailText.Text = selectedClient.email;
            }
        }
        public void MastersTabLoad()
        {
            _masters = ConnectionDb.db.Masters.ToList();
            MastersList.ItemsSource = _masters;
        }
        private void MastersList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var selectedMaster = MastersList.SelectedItem as Masters;
            _selectedMaster = selectedMaster;
            if (selectedMaster != null)
            {
                MasterFnameText.Text = selectedMaster.Fname;
                MasterLnameText.Text = selectedMaster.Lname;
                MasterPatronymicText.Text = selectedMaster.Patronymic;
                MasterPhoneText.Text = selectedMaster.phone;
                MasterEmailText.Text = selectedMaster.email;
                MasterSkillText.Text = selectedMaster.MastersSkills.name;
                MasterQualificationText.Text = selectedMaster.MastersQualifications.TypeServices.name;
            }
            ServicesTabLoad();
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
        public void ServicesTabLoad()
        {

            _services = ConnectionDb.db.ServiceSkill.Where(s => s.MastersSkills.skillId == _selectedMaster.MastersSkills.skillId && s.Services.TypeServices.id == _selectedMaster.MastersQualifications.TypeServices.id).ToList();
            _allServices = _services;
            ServicesList.ItemsSource = _allServices;

        }
        private void ServiceSearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            var searchText = ServiceSearchText.Text.ToLower();
            var filtered = _allServices.Where(a => a.Services.serviceName.ToLower().Contains(searchText)
            ).ToList();
            ServicesList.ItemsSource = filtered;
        }

        private async void AddService_Click(object sender, RoutedEventArgs e)
        {
            var selected = ServicesList.SelectedItem as ServiceSkill;
            if (selected != null)
            {
                if (!_selectedServices.Contains(selected))
                {
                    _selectedServices.Add(selected);
                    _allServices.Remove(selected);

                    ServicesList.ItemsSource = _allServices;

                    SelectedServicesList.ItemsSource = null;
                    SelectedServicesList.ItemsSource = _selectedServices;
                }
                else
                {
                    Growl.Error("Услуга уже добавлена в список выбранных услуг");
                    await Task.Delay(1000);
                    Growl.Clear();
                }
            }
        }
        private async void RemoveService_Click(object sender, RoutedEventArgs e)
        {
            var selected = SelectedServicesList.SelectedItem as ServiceSkill;

            if (selected != null)
            {
                _allServices.Add(selected);
                _selectedServices.Remove(selected);

                ServicesList.ItemsSource = _allServices;

                SelectedServicesList.ItemsSource = null;
                SelectedServicesList.ItemsSource = _selectedServices;
            }
        }

        private void ServicesList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

        }
        private void SelectedServicesList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

        }
        public void AppointmentsTabLoad()
        {
            _appointments = ConnectionDb.db.Appointments.ToList();
        }
        private void AvailableSlotsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var selected = AvailableSlotsList.SelectedItem as TimeSpan?;
            if (selected.HasValue != null)
            {
                selectedTime = selected.Value;
            }
        }
        public void ConfirmTabLoad()
        {
            SelectedServicesListConfirm.ItemsSource = _selectedServices;
            ClientText.Text = _selectedClient.Lname + " " + _selectedClient.FName;
            MasterText.Text = _selectedMaster.Lname + " " + _selectedMaster.Fname + " " + _selectedMaster.Patronymic;
            int totalTime = (int)_selectedServices.Sum(s => s.runTime);
            int totalPrice = (int)_selectedServices.Sum(s => s.price);
            TimeSpan timeSpan = TimeSpan.FromMinutes(totalTime);
            int hours = timeSpan.Hours;
            int minutes = timeSpan.Minutes;
            totalPriceText.Text = totalPrice + "  ₽";
            totalTimeText.Text = $"{hours} ч. {minutes} мин.";
            timeText.Text = selectedTime.Value.ToString(@"hh\:mm");
            dateText.Text = selectedDate.Value.ToString("dd.MM.yyyy");

        }

        private void DateText_SelectedDateChanged(object sender, SelectionChangedEventArgs e)
        {

            var date = DateText.SelectedDate;

            int totalDuration = (int)_selectedServices.Sum(s => s.runTime);

            List<TimeSpan> availableSlots = GetAvailableTimeSlots(_selectedMaster, date.Value, totalDuration);

            AvailableSlotsList.ItemsSource = availableSlots;
            selectedDate = (DateTime)date;
        }
        private List<TimeSpan> GetAvailableTimeSlots(Masters master, DateTime date, int duration)
        {
            var availableSlots = new List<TimeSpan>();
            var startTime = new TimeSpan(9, 0, 0);
            var endTime = new TimeSpan(21, 0, 0);
            var appointmentDurations = TimeSpan.FromMinutes(duration);

            for (var time = startTime; time.Add(appointmentDurations) <= endTime; time = time.Add(TimeSpan.FromMinutes(30)))
            {
                bool isAvailable = !_appointments.Any(a =>
                    a.Masters.masterId == master.masterId &&
                    a.date == date &&
                    ((a.timeStart <= time && a.timeEnd > time) ||
                     (a.timeStart < time.Add(appointmentDurations) && a.timeEnd >= time.Add(appointmentDurations))));

                if (isAvailable)
                {
                    availableSlots.Add(time);
                }
            }
            return availableSlots;
        }

        private async void CreateAppointmentButton_Click(object sender, RoutedEventArgs e)
        {
            int totalTime = (int)_selectedServices.Sum(s => s.runTime);
            int totalPrice = (int)_selectedServices.Sum(s => s.price);
            var appointment = new Appointments()
            {
                Masters = _selectedMaster,
                timeStart = selectedTime,
                timeEnd = selectedTime.Value.Add(TimeSpan.FromMinutes(totalTime)),
                statusId = 2,
                totalDuration = totalTime,
                totalSum = totalPrice,
                date = selectedDate,
                Clients = _selectedClient
            };
            ConnectionDb.db.Appointments.Add(appointment);
            foreach (ServiceSkill serviceskill in _selectedServices)
            {
                var service = serviceskill.Services;
                var temp = new AppointmentsServices()
                {
                    Appointments = appointment,
                    Services = service
                };
                ConnectionDb.db.AppointmentsServices.Add(temp);
            }
            var salary = await ConnectionDb.db.MastersSalaries.FirstOrDefaultAsync(s => s.masterId == _selectedMaster.masterId && s.month == DateTime.Now.Month && s.year == DateTime.Now.Year);
            var mastersGain = appointment.totalSum * ((double)_selectedMaster.MastersSkills.rate / 100);
            salary.salary += (int)mastersGain;
            ConnectionDb.db.SaveChanges();
            _owner.UpdateAppoinmentsList();
            Growl.Success("Запись создана");
            await Task.Delay(1500);
            Growl.Clear();
            this.Close();
        }

        private async void TabControl_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (TabControl.SelectedIndex == 1)
            {
                if (_selectedClient == null)
                {
                    TabControl.SelectedIndex--;
                    Growl.Error("Выберите клиента");
                    await Task.Delay(1500);
                    Growl.Clear();
                }

            }
            if (TabControl.SelectedIndex == 2)
            {
                if (_selectedMaster != null)
                {
                    ServicesTabLoad();
                }
                else
                {
                    TabControl.SelectedIndex--;
                    Growl.Error("Выберите мастера");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
            }
            if (TabControl.SelectedIndex == 3)
            {
                if (_selectedServices.Count <= 0)
                {
                    TabControl.SelectedIndex--;
                    Growl.Error("Выберите услуги");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
                else
                {
                    AppointmentsTabLoad();

                }
                if (_selectedClient == null)
                {
                    TabControl.SelectedIndex -= 2;
                    Growl.Error("Выберите клиента");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
                if (_selectedMaster == null)
                {
                    TabControl.SelectedIndex -= 1;
                    Growl.Error("Выберите мастера");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
            }
            if (TabControl.SelectedIndex == 4)
            {
                if (_selectedServices.Count <= 0)
                {
                    TabControl.SelectedIndex--;
                    Growl.Error("Выберите услуги");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
                else
                {
                    AppointmentsTabLoad();

                }
                if (_selectedClient == null)
                {
                    TabControl.SelectedIndex -= 3;
                    Growl.Error("Выберите клиента");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
                if (_selectedMaster == null)
                {
                    TabControl.SelectedIndex -= 2;
                    Growl.Error("Выберите мастера");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
                if (!selectedDate.HasValue || !selectedTime.HasValue)
                {
                    TabControl.SelectedIndex--;
                    Growl.Error("Выберите время");
                    await Task.Delay(1500);
                    Growl.Clear();
                }
                if (selectedDate.HasValue && selectedTime.HasValue)
                {
                    ConfirmTabLoad();

                }
            }
            if (TabControl.SelectedItem is System.Windows.Controls.TabItem selectedTab)
            {
                int currentTabIndex = TabControl.Items.IndexOf(selectedTab) + 1;

                if (prevTabIndex != 0)
                {
                    if (currentTabIndex > prevTabIndex)
                    {
                        int diff = currentTabIndex - prevTabIndex;
                        for (int i = 0; i < diff; i++)
                        {
                            Steps.Next();
                        }
                    }
                    else if (currentTabIndex < prevTabIndex)
                    {
                        int diff = prevTabIndex - currentTabIndex;
                        for (int i = 0; i < diff; i++)
                        {
                            Steps.Prev();
                        }
                    }
                }
                prevTabIndex = currentTabIndex;
            }
        }


    }
}
