using BeautySalonWpf.Pages.Admin.Tabs;
using HandyControl.Controls;
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
using System.Windows.Shapes;

namespace BeautySalonWpf.WindowDialogs.AdminPage.Appointments
{
    /// <summary>
    /// Логика взаимодействия для AddAppointment.xaml
    /// </summary>
    public partial class AddAppointment : System.Windows.Window
    {
        private AppointmentsTab _owner;
        private List<Clients> _clients;
        private Clients _selectedClient;
        int prevTabIndex = 0;
        public AddAppointment(AppointmentsTab owner)
        {
            InitializeComponent();
            _owner = owner;
            ClientTabLoad();
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

        private async void TabControl_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (TabControl.SelectedItem is System.Windows.Controls.TabItem selectedTab)
            {
                int currentTabIndex = TabControl.Items.IndexOf(selectedTab)+1;

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
