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
using System.Net;
using System.Net.Mail;
using Newtonsoft.Json.Linq;
using System.IO;

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
            ProvidersTabFrame.Navigate(new ProviderTab());
            ServicesTabFrame.Navigate(new ServicesTab());
            AppointmentsFrame.Navigate(new AppointmentsTab());
        }

        public void MasterStartSettings()
        {
            
        }
        //ot salonwpf gZwrWpzVeyS15wEy0x3v
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var json = File.ReadAllText("C:\\Users\\Ильдар\\source\\repos\\BeautySalonWpf\\BeautySalonWpf\\secrets.json").Replace("\\", "/");
            var secrets = JObject.Parse(json);
            string smtpPassword = secrets["SmtpPassword"].ToString();

            string smtpServer = "smtp.mail.ru";
            int smtpPort = 587; 
            string smtpUsername = "farrahovildar1112@mail.ru";

            using (SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort))
            {
                smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                smtpClient.EnableSsl = true;

                using (MailMessage mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(smtpUsername);
                    mailMessage.To.Add("farrahovildar1112@gmail.ru"); 
                    mailMessage.Subject = "Данные от входа в ИС мероприятий";
                    mailMessage.Body = $"Логин: dsdsd \r\nПароль: sdsdd";
                    try
                    {
                        smtpClient.Send(mailMessage);
                        Console.WriteLine("Сообщение успешно отправлено.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Ошибка отправки сообщения: {ex.Message}");
                    }
                }
            }

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
