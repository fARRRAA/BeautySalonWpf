using BeautySalonWpf.Pages;
using HandyControl.Tools;
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

namespace BeautySalonWpf
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        // Переменная для хранения текущего состояния темы
        private bool _isDarkTheme = false;

        public MainWindow()
        {
            InitializeComponent();
            ConfigHelper.Instance.SetLang("ru");
            
            // Определяем текущую тему из системы
            try
            {
                Microsoft.Win32.RegistryKey key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize");
                if (key != null)
                {
                    object value = key.GetValue("AppsUseLightTheme");
                    if (value != null && value is int)
                    {
                        // 0 означает, что используется темная тема
                        _isDarkTheme = (int)value == 0;

                    }
                }
            }
            catch
            {
                // В случае ошибки используем светлую тему по умолчанию
            }
            
            MainFrame.NavigationService.Navigate(new SignIn(this));
        }



        public void ChangeWindowSize(double height, double width)
        {
            this.Width = width;
            this.Height = height;
            this.ResizeMode = ResizeMode.NoResize;
        }
    }
}