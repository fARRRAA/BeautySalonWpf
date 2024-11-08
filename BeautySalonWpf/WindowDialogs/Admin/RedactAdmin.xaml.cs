﻿using HandyControl.Controls;
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

namespace BeautySalonWpf.WindowDialogs
{
    /// <summary>
    /// Логика взаимодействия для RedactAdmin.xaml
    /// </summary>
    public partial class RedactAdmin : System.Windows.Window
    {
        private Admins _admin;
        private ListView _adminsList;
        public RedactAdmin(Admins admin, ListView adminsList)
        {
            InitializeComponent();
            _admin = admin;
            _adminsList = adminsList;
            FillFieldsWInfo();
        }

        private void CloseRedactBtn_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
        private async void ConfirmRedactBtn_Click(object sender, RoutedEventArgs e)
        {
            var inputs = new[]
               {
        LoginText.Text,
        FNameText.Text,
        LNameText.Text,
        PhoneText.Text,
        EmailText.Text,
        PasswordText.Password
                };

            if (inputs.Any(string.IsNullOrWhiteSpace) || !DateBirthText.SelectedDate.HasValue)
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }

            var admin = await ConnectionDb.db.Admins.FirstOrDefaultAsync(a => a.login == LoginText.Text);
            if (admin == null)
            {
                Growl.Error("Администратор не найден.");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }

            admin.Fname = FNameText.Text;
            admin.Lname = LNameText.Text;
            admin.email = EmailText.Text;
            admin.password = PasswordText.Password;
            admin.dateBirth = DateBirthText.SelectedDate;
            admin.phone = PhoneText.Text;
            admin.login = LoginText.Text;

            await ConnectionDb.db.SaveChangesAsync();

            Growl.Success("Редактирование прошло успешно");
            await Task.Delay(1000);
            Growl.Clear();

            _adminsList.ItemsSource = await ConnectionDb.db.Admins.ToListAsync();
            this.Close();
        }
        private void FillFieldsWInfo()
        {
            FNameText.Text = _admin.Fname;
            LNameText.Text = _admin.Lname;
            PatronymicText.Text = _admin.Patronymic;
            DateBirthText.SelectedDate = _admin.dateBirth;
            PhoneText.Text = _admin.phone;
            EmailText.Text = _admin.email;
            LoginText.Text = _admin.login;
            //var uri=new Uri("pack://application:,,,/imgs/pfp/admins/admin1.png");
            //PhotoPicker.Uri = uri;
        }
        //catch (DbEntityValidationException dbEx)
        //{
        //    foreach (var validationErrors in dbEx.EntityValidationErrors)
        //    {
        //        foreach (var validationError in validationErrors.ValidationErrors)
        //        {
        //            Growl.Error($"Свойство: {validationError.PropertyName}, Ошибка: {validationError.ErrorMessage}");
        //        }
        //    }
        //}
        //catch (Exception ex)
        //{
        //    Growl.Error($"Произошла ошибка: {ex.Message}");
        //}
    }
}
//}
