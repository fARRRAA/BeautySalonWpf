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
using System.Net.Http;
using System.Threading.Tasks;


namespace BeautySalonWpf.Pages.Admin
{


    public partial class AdminPage : Page
    {
        private MainWindow _mw;
        private Admins _admin;
        private List<Admins> _admins;
        private List<string> choosedTypes=new List<string>();
        private static readonly HttpClient httpClient = new HttpClient();
        private const string ApiKey = "CF3044CE-B265-C317-6797-EF5C86BAC6BD"; // Укажите ваш API-ключ
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
            DeliveryTabFrame.Navigate(new DeliveryTab());
        }

        public void MasterStartSettings()
        {

        }

        //private async void Button_Click(object sender, RoutedEventArgs e)
        //{
        //    string phoneNumber = "79393844323"; 
        //    string message = "Миша лох"; 

        //    await SendSmsAsync(phoneNumber, message);

        //}
        //static async Task SendSmsAsync(string phone, string message)
        //{
        //    string url = $"https://sms.ru/sms/send?api_id={ApiKey}&to={phone}&msg={Uri.EscapeDataString(message)}&json=1";

        //    var response = await httpClient.GetAsync(url);
        //        response.EnsureSuccessStatusCode();

        //        var responseBody = await response.Content.ReadAsStringAsync();
        //    Growl.Success($"{responseBody}");
        //}
    }
}
