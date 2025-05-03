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
using HandyControl.Themes;
using HandyControl.Tools.Helper;
using System.Windows.Media.Animation;

namespace BeautySalonWpf
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        // Переменная для хранения текущего состояния темы
        private bool _isDarkTheme = true;

        public MainWindow()
        {
            InitializeComponent();
            ConfigHelper.Instance.SetLang("ru");

            // Устанавливаем текущую тему на основе ThemeManager
            _isDarkTheme = ThemeManager.Current.ActualApplicationTheme == ApplicationTheme.Dark;
            
            MainFrame.NavigationService.Navigate(new SignIn(this));
        }


        /// <summary>
        /// Анимация смены темы с эффектом радиального градиента
        /// </summary>
        private async void AnimateThemeWithRadialGradient(Button sourceButton, Action themeChangeAction)
        {
            var button = sourceButton;
            if (button == null) 
            {
                // Если кнопка не доступна, просто меняем тему без анимации
                themeChangeAction?.Invoke();
                return;
            }

            await Dispatcher.InvokeAsync(async () => {
                try
                {
                    // Получаем позицию кнопки относительно окна
                    Point buttonPosition = button.TranslatePoint(new Point(button.ActualWidth / 2, button.ActualHeight / 2), this);

                    // Создаем радиальный градиент
                    RadialGradientBrush radialGradient = new RadialGradientBrush();
                    radialGradient.GradientOrigin = new Point(0.5, 0.5);
                    radialGradient.Center = new Point(0.5, 0.5);
                    radialGradient.RadiusX = 0.1;
                    radialGradient.RadiusY = 0.1;
                    radialGradient.GradientStops.Add(new GradientStop(_isDarkTheme ? Colors.Black : Colors.White, 0.0));
                    radialGradient.GradientStops.Add(new GradientStop(Colors.Transparent, 1.0));

                    // Создаем прямоугольник для анимации
                    Rectangle overlay = new Rectangle
                    {
                        Fill = radialGradient,
                        Opacity = 0.7
                    };

                    // Добавляем его на Grid окна
                    var mainGrid = (Grid)this.Content;
                    mainGrid.Children.Add(overlay);
                    Grid.SetRowSpan(overlay, mainGrid.RowDefinitions.Count);
                    Grid.SetColumnSpan(overlay, mainGrid.ColumnDefinitions.Count);
                    Panel.SetZIndex(overlay, 9999);

                    // Анимация увеличения радиуса градиента
                    DoubleAnimation radiusAnimation = new DoubleAnimation
                    {
                        From = 0.1,
                        To = 2.0,
                        Duration = TimeSpan.FromSeconds(0.5),
                        AccelerationRatio = 0.3,
                        DecelerationRatio = 0.7
                    };

                    // Устанавливаем точку начала градиента относительно размеров окна
                    double relativeX = buttonPosition.X / this.ActualWidth;
                    double relativeY = buttonPosition.Y / this.ActualHeight;
                    
                    radialGradient.Center = new Point(relativeX, relativeY);
                    radialGradient.GradientOrigin = new Point(relativeX, relativeY);

                    radiusAnimation.Completed += (s, e) =>
                    {
                        // Меняем тему по завершении анимации
                        themeChangeAction?.Invoke();

                        // Удаляем оверлей
                        mainGrid.Children.Remove(overlay);
                    };

                    // Запускаем анимацию радиуса
                    radialGradient.BeginAnimation(RadialGradientBrush.RadiusXProperty, radiusAnimation);
                    radialGradient.BeginAnimation(RadialGradientBrush.RadiusYProperty, radiusAnimation);
                }
                catch
                {
                    // В случае ошибки, просто меняем тему
                    themeChangeAction?.Invoke();
                }
            });
        }
        
        /// <summary>
        /// Анимация смены темы через масштабирование
        /// </summary>
        private void AnimateThemeWithScale(Action themeChangeAction)
        {
            // Находим элемент Frame для анимации
            var contentFrame = MainFrame;
            if (contentFrame != null)
            {
                // Создаем анимацию уменьшения масштаба
                ScaleTransform scaleTransform = new ScaleTransform(1, 1);
                contentFrame.RenderTransform = scaleTransform;
                contentFrame.RenderTransformOrigin = new Point(0.5, 0.5);
                
                DoubleAnimation scaleOutX = new DoubleAnimation
                {
                    From = 1.0,
                    To = 0.95,
                    Duration = TimeSpan.FromSeconds(0.15)
                };
                
                DoubleAnimation scaleOutY = new DoubleAnimation
                {
                    From = 1.0,
                    To = 0.95,
                    Duration = TimeSpan.FromSeconds(0.15)
                };
                
                // Анимация прозрачности
                DoubleAnimation fadeOut = new DoubleAnimation
                {
                    From = 1.0,
                    To = 0.5,
                    Duration = TimeSpan.FromSeconds(0.15)
                };
                
                // Назначаем обработчик завершения анимации
                fadeOut.Completed += (s, e) =>
                {
                    // Меняем тему во время анимации
                    themeChangeAction?.Invoke();
                    
                    // Анимация увеличения масштаба
                    DoubleAnimation scaleInX = new DoubleAnimation
                    {
                        From = 0.95,
                        To = 1.0,
                        Duration = TimeSpan.FromSeconds(0.15)
                    };
                    
                    DoubleAnimation scaleInY = new DoubleAnimation
                    {
                        From = 0.95,
                        To = 1.0,
                        Duration = TimeSpan.FromSeconds(0.15)
                    };
                    
                    // Анимация прозрачности
                    DoubleAnimation fadeIn = new DoubleAnimation
                    {
                        From = 0.5,
                        To = 1.0,
                        Duration = TimeSpan.FromSeconds(0.15)
                    };
                    
                    // Запускаем анимации возврата
                    scaleTransform.BeginAnimation(ScaleTransform.ScaleXProperty, scaleInX);
                    scaleTransform.BeginAnimation(ScaleTransform.ScaleYProperty, scaleInY);
                    contentFrame.BeginAnimation(UIElement.OpacityProperty, fadeIn);
                };
                
                // Запускаем анимацию
                scaleTransform.BeginAnimation(ScaleTransform.ScaleXProperty, scaleOutX);
                scaleTransform.BeginAnimation(ScaleTransform.ScaleYProperty, scaleOutY);
                contentFrame.BeginAnimation(UIElement.OpacityProperty, fadeOut);
            }
            else
            {
                // Если элемент не найден, просто меняем тему
                themeChangeAction?.Invoke();
            }
        }


        public void ChangeWindowSize(double height, double width)
        {
            this.Width = width;
            this.Height = height;
            this.ResizeMode = ResizeMode.NoResize;
        }
    }
}