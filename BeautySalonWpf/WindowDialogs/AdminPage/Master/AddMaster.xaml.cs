using BeautySalonWpf.Pages.Admin.Tabs;
using HandyControl.Controls;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
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
    /// Логика взаимодействия для AddMaster.xaml
    /// </summary>
    public partial class AddMaster : System.Windows.Window
    {
        private Masters tempMaster = new Masters();
        private List<MastersQualifications> _qualifications = ConnectionDb.db.MastersQualifications.ToList();
        private List<MastersSkills> _skills = ConnectionDb.db.MastersSkills.ToList();
        private MastersTab _owner;
        public AddMaster(MastersTab owner)
        {
            InitializeComponent();
            QualificationText.ItemsSource = _qualifications.Select(p => p.TypeServices.name);
            SkillText.ItemsSource = _skills.Select(p => p.name);
            _owner = owner;
        }

        private async void ConfirmAddBtn_Click(object sender, RoutedEventArgs e)
        {
            var inputs = new[]
              {
        LoginText.Text,
        FNameText.Text,
        LNameText.Text,
        PatronymicText.Text,
        PhoneText.Text,
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

            var master = await ConnectionDb.db.Masters.FirstOrDefaultAsync(a => a.login == LoginText.Text);
            if (master != null)
            {
                Growl.Error("Мастер с таким логином существует.");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            try
            {
                tempMaster.Fname = FNameText.Text;
                tempMaster.Lname = LNameText.Text;
                tempMaster.email = EmailText.Text;
                tempMaster.Patronymic = PatronymicText.Text;
                tempMaster.password = PasswordText.Password;
                tempMaster.dateBirth = DateBirthText.SelectedDate;
                tempMaster.phone = PhoneText.Text;
                tempMaster.login = LoginText.Text;
                tempMaster.MastersQualifications = _qualifications.FirstOrDefault(q => q.TypeServices.name == QualificationText.SelectedItem.ToString());
                tempMaster.MastersSkills = _skills.FirstOrDefault(s => s.name == SkillText.SelectedItem.ToString());
                tempMaster.roleId = 2;
                ConnectionDb.db.Masters.Add(tempMaster);
                ConnectionDb.db.SaveChanges();
                Growl.Success("Добавление прошло успешно");
                await Task.Delay(1000);
                Growl.Clear();
                _owner.UpdateMastersList();
                this.DialogResult=true;
            }
            catch (DbEntityValidationException dbEx)
            {
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        Growl.Error($"Свойство: {validationError.PropertyName}, Ошибка: {validationError.ErrorMessage}");
                    }
                }
            }
            catch (Exception ex)
            {
                Growl.Error($"Произошла ошибка: {ex.Message}");
            }

        }

        private void CloseAddBtn_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void addPhoto_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
