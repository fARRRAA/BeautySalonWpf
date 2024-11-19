using BeautySalonWpf.Pages.Admin.Tabs;
using BeautySalonWpf.Pages.Master;
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

namespace BeautySalonWpf.WindowDialogs.MasterPage
{
    /// <summary>
    /// Логика взаимодействия для MasterRedactClient.xaml
    /// </summary>
    public partial class MasterRedactClient : System.Windows.Window
    {
        private ClientPage _owner;

        private Clients _client;

        public MasterRedactClient(ClientPage owner, Clients client)
        {
            InitializeComponent();
            _owner = owner;
            _client = client;
            FillFieldsWInfo();

        }
        private void FillFieldsWInfo()
        {

            PreferencesText.Text = _client.Preferences;

        }
        private async void ConfirmAddBtn_Click(object sender, RoutedEventArgs e)
        {
            var inputs = new[]
            {
                   PreferencesText.Text
            };

            if (inputs.Any(string.IsNullOrWhiteSpace))
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var client = await ConnectionDb.db.Clients.FirstOrDefaultAsync(a => a.login == _client.login);
            client.Preferences = PreferencesText.Text;
            await ConnectionDb.db.SaveChangesAsync();
            Growl.Success("Редактирование прошло успешно");
            await Task.Delay(1000);
            Growl.Clear();
            _owner.UpdateClientsList();
            this.Close();
        }

        private void CloseAddBtn_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
    }
}
