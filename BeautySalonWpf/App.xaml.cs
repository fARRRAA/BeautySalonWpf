using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Diagnostics;
using System.Windows.Media;

namespace BeautySalonWpf
{
    /// <summary>
    /// Логика взаимодействия для App.xaml
    /// </summary>
    public partial class App : Application
    {
        private static readonly Color DarkBackgroundColor = Color.FromRgb(0x2C, 0x2C, 0x2E);
        private static readonly Color DarkTextColor = Colors.White;
        
        private static readonly Color LightBackgroundColor = Colors.White;
        private static readonly Color LightTextColor = Colors.Black;
        
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            
            bool isDarkTheme = IsSystemUsingSolidColorTheme();
            SetTheme(isDarkTheme);
        }
        
        private bool IsSystemUsingSolidColorTheme()
        {
            try
            {
                Microsoft.Win32.RegistryKey key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize");
                if (key != null)
                {
                    object value = key.GetValue("AppsUseLightTheme");
                    if (value != null && value is int)
                    {
                        // 0 означает, что используется темная тема
                        return (int)value == 0;
                    }
                }
            }
            catch
            {
                // В случае ошибки возвращаем false (светлая тема по умолчанию)
            }
            return false;
        }
        
        /// <summary>
        /// Метод для ручного переключения темы
        /// </summary>
        /// <param name="isDark">true - тёмная тема, false - светлая тема</param>
        public static void SetTheme(bool isDark)
        {
            // Получаем ресурсы приложения
            var resources = Application.Current.Resources;
            
            // Создаем новые кисти вместо изменения существующих
            SolidColorBrush backgroundBrush = new SolidColorBrush(
                isDark ? DarkBackgroundColor : LightBackgroundColor);
                
            SolidColorBrush textBrush = new SolidColorBrush(
                isDark ? DarkTextColor : LightTextColor);
            
            // Заменяем существующие ресурсы новыми кистями
            resources["BackgroundBrush"] = backgroundBrush;
            resources["TextBrush"] = textBrush;
        }
    }
}
