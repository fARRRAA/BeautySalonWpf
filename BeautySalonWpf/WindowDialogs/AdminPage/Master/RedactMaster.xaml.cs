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

namespace BeautySalonWpf.WindowDialogs.Master
{
    /// <summary>
    /// Логика взаимодействия для RedactMaster.xaml
    /// </summary>
    public partial class RedactMaster : System.Windows.Window
    {
        private MastersTab _owner;
        private Masters _master;
        private List<MastersQualifications> _qualifications = ConnectionDb.db.MastersQualifications.ToList();
        private List<MastersSkills> _skills = ConnectionDb.db.MastersSkills.ToList();
        private string adminProfilePhotoFolder = "C:\\Users\\Ильдар\\source\\repos\\BeautySalonWpf\\BeautySalonWpf\\imgs\\pfp\\masters\\".Replace("\\", "/");
        string removePath = "/imgs/pfp/admins/";
        public RedactMaster(Masters master,MastersTab owner)
        {
            _owner = owner;
            _master = master;
            InitializeComponent();
            FillFieldsWInfo();
            QualificationText.ItemsSource = _qualifications.Select(p => p.TypeServices.name);
            SkillText.ItemsSource = _skills.Select(p => p.name);
        }

        private async void ConfirmAddBtn_Click(object sender, RoutedEventArgs e)
        {
            var inputs = new[]
              {
        LoginText.Text,
        FNameText.Text,
        LNameText.Text,
        PhoneText.Text,
                PatronymicText.Text,

        EmailText.Text,
        PasswordText.Password,
        QualificationText.SelectedItem.ToString(),
        SkillText.SelectedItem.ToString()
                };

            if (inputs.Any(string.IsNullOrWhiteSpace) || !DateBirthText.SelectedDate.HasValue)
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var check = await ConnectionDb.db.Masters.FirstOrDefaultAsync(a => a.login == LoginText.Text&& a.masterId!=_master.masterId);
            if (check != null)
            {
                Growl.Error("Мастер с таким логином существует.");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var master = await ConnectionDb.db.Masters.FirstOrDefaultAsync(a => a.login == _master.login);

            master.Fname = FNameText.Text;
            master.Lname = LNameText.Text;
            master.email = EmailText.Text;
            master.Patronymic = PatronymicText.Text;
            master.password = PasswordText.Password;
            master.dateBirth = DateBirthText.SelectedDate;
            master.phone = PhoneText.Text;
            master.login = LoginText.Text;
            master.MastersQualifications = _qualifications.FirstOrDefault(q => q.TypeServices.name == QualificationText.SelectedItem.ToString());
            master.MastersSkills = _skills.FirstOrDefault(s => s.name == SkillText.SelectedItem.ToString());
            await ConnectionDb.db.SaveChangesAsync();
            Growl.Success("Редактирование прошло успешно");
            await Task.Delay(1000);
            Growl.Clear();
            _owner.UpdateMastersList();
            this.Close();
        }

        private void CloseAddBtn_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
        private void FillFieldsWInfo()
        {
            FNameText.Text = _master.Fname;
            LNameText.Text = _master.Lname;
            PatronymicText.Text = _master.Patronymic;
            DateBirthText.SelectedDate = _master.dateBirth;
            PhoneText.Text = _master.phone;
            EmailText.Text = _master.email;
            LoginText.Text = _master.login;
            QualificationText.SelectedItem = _master.MastersQualifications.TypeServices.name;
            SkillText.SelectedItem = _master.MastersSkills.name;
            if (!string.IsNullOrWhiteSpace(_master.photo))
            {
                Photo.Source = new BitmapImage(new Uri(System.IO.Path.Combine(adminProfilePhotoFolder, _master.photo.Replace(removePath, string.Empty)), UriKind.RelativeOrAbsolute));
            }
        }

        private void addPhoto_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
