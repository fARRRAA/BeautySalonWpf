using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Diagnostics;
using System.Windows.Media;
using HandyControl.Themes;
using HandyControl.Tools;
using HandyControl.Data;

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
            
            // Принудительно устанавливаем тёмную тему при запуске
            ThemeManager.Current.ApplicationTheme = ApplicationTheme.Dark;
            
            // Обработка системной темы происходит через HandyControl
            // Настройка происходит через App.xaml в ThemeResources
        }
        
        private void ThemeResources_OnSystemThemeChanged(object sender, FunctionEventArgs<ThemeManager.SystemTheme> e)
        {
            Debug.WriteLine($"Системная тема изменена: {e.Info.CurrentTheme}");
            
            // Дополнительные действия при изменении системной темы
            // Например, логирование или обновление специфичных элементов
            
            Application.Current.Dispatcher.Invoke(() => {
                // Обновление пользовательских ресурсов соответственно системной теме
                UpdateCustomResources(e.Info.CurrentTheme == ApplicationTheme.Dark);
            });
        }
        
        /// <summary>
        /// Метод для ручного переключения темы
        /// </summary>
        /// <param name="isDark">true - тёмная тема, false - светлая тема</param>
        public static void SetTheme(bool isDark)
        {
            // Изменяем тему через ThemeManager
            ThemeManager.Current.ApplicationTheme = isDark 
                ? ApplicationTheme.Dark 
                : ApplicationTheme.Light;
                
            // Обновляем пользовательские ресурсы
            UpdateCustomResources(isDark);
        }
        
        /// <summary>
        /// Обновляет пользовательские ресурсы в соответствии с выбранной темой
        /// </summary>
        private static void UpdateCustomResources(bool isDark)
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
