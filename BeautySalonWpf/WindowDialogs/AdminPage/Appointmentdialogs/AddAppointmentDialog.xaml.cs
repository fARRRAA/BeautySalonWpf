using BeautySalonWpf.Pages.Admin.Tabs;
using HandyControl.Controls;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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

namespace BeautySalonWpf.WindowDialogs.AdminPage.Appointmentdialogs
{
    /// <summary>
    /// Логика взаимодействия для AddAppointmentDialog.xaml
    /// </summary>

    public partial class AddAppointmentDialog : System.Windows.Window
    {
        private AppointmentsTab _owner;
        
        // Клиент
        private Clients _selectedClient;
        
        // Данные для первой вкладки (выбор услуг)
        private List<TypeServices> _categories = new List<TypeServices>();
        private List<ServiceSkill> _allServices = new List<ServiceSkill>();
        private List<ServiceSkill> _filteredServices = new List<ServiceSkill>();
        private ObservableCollection<ServiceSkill> _selectedServices = new ObservableCollection<ServiceSkill>();
        private int _selectedSkillLevel = 1; // 1 - младший, 2 - средний, 3 - старший

        // Данные для второй вкладки (выбор даты и мастера)
        private DateTime? _selectedDate;
        private List<Masters> _availableMasters = new List<Masters>();
        private Masters _selectedMaster;
        private TimeSpan? _selectedTimeSlot;
        
        // Данные для вычислений
        private int _totalDuration = 0;
        private int _totalPrice = 0;
        
        public AddAppointmentDialog(AppointmentsTab owner)
        {
            try
            {
                InitializeComponent();
                _owner = owner;
                
                // Инициализация коллекций во избежание NullReferenceException
                _categories = new List<TypeServices>();
                _allServices = new List<ServiceSkill>();
                _filteredServices = new List<ServiceSkill>();
                _selectedServices = new ObservableCollection<ServiceSkill>();
                _availableMasters = new List<Masters>();
                
                // По умолчанию, выбираем текущего клиента (для административного интерфейса)
                _selectedClient = ConnectionDb.db.Clients.FirstOrDefault(c => c.userID == 1); // Заменить на реального клиента
                
                // Привязываем коллекции к элементам управления
                SelectedServicesList.ItemsSource = _selectedServices;
                ConfirmationServicesList.ItemsSource = _selectedServices;
                
                // Инициализация первой вкладки
                LoadCategories();
                LoadSkillLevelComboBox();
                UpdateTotalSummary();
                
                // Установить сегодняшнюю дату как минимальную в календаре
                var today = DateTime.Today;
                AppointmentDatePicker.DisplayDateStart = today;
                AppointmentDatePicker.BlackoutDates.AddDatesInPast();
                
                // Добавить воскресенья в черные даты
                for (DateTime date = today; date < today.AddYears(1); date = date.AddDays(1))
                {
                    if (date.DayOfWeek == DayOfWeek.Sunday)
                    {
                        AppointmentDatePicker.BlackoutDates.Add(new CalendarDateRange(date));
                    }
                }

                // Инициализируем StepBar
                Steps.StepIndex = 0;
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка инициализации: {ex.Message}");
            }
        }
        
        #region Первая вкладка: Выбор услуги и уровня мастера
        
        private void LoadCategories()
        {
            try
            {
                // Загрузка категорий услуг
                _categories = ConnectionDb.db.TypeServices.ToList();
                
                // Создаем список категорий
                List<TypeServices> categoriesWithAll = new List<TypeServices>();
                
                // Создаем объект "Все категории"
                TypeServices allCategories = new TypeServices();
                allCategories.id = 0;
                allCategories.name = "Все категории";
                
                // Добавляем в список
                categoriesWithAll.Add(allCategories);
                categoriesWithAll.AddRange(_categories);
                
                // Привязываем к ComboBox
                CategoriesList.ItemsSource = categoriesWithAll;
                CategoriesList.SelectedIndex = 0; // Выбираем "Все категории" по умолчанию
                
                // Загружаем услуги только для выбранного уровня мастера
                _allServices = ConnectionDb.db.ServiceSkill
                    .Where(s => s.MastersSkills.skillId == _selectedSkillLevel)
                    .ToList();
                    
                LoadServices();
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка загрузки данных: {ex.Message}");
            }
        }
        
        private void LoadSkillLevelComboBox()
        {
            // Инициализация списка уровней мастерства
            SkillLevelComboBox.SelectedIndex = 0; // Младший мастер по умолчанию
        }
        
        private void LoadServices(int? categoryId = null)
        {
            try
            {
                // Проверяем, что ServicesList не null
                if (ServicesList == null)
                {
                    Growl.Error("Список услуг не инициализирован");
                    return;
                }
                
                // Проверяем, что _allServices не null
                if (_allServices == null)
                {
                    _allServices = new List<ServiceSkill>();
                    Growl.Warning("Список всех услуг не инициализирован");
                }
                
                // Инициализируем _filteredServices, если он null
                if (_filteredServices == null)
                {
                    _filteredServices = new List<ServiceSkill>();
                }
                
                // Фильтрация услуг по категории (если выбрана)
                if (categoryId.HasValue)
                {
                    _filteredServices = _allServices
                        .Where(s => s.Services.typeServiceId == categoryId.Value)
                        .ToList();
                }
                else
                {
                    _filteredServices = _allServices.ToList();
                }
                
                // Применение фильтра поиска, если есть
                if (ServiceSearchText != null && !string.IsNullOrEmpty(ServiceSearchText.Text))
                {
                    string searchText = ServiceSearchText.Text.ToLower();
                    _filteredServices = _filteredServices
                        .Where(s => s.Services != null && s.Services.serviceName != null && 
                              s.Services.serviceName.ToLower().Contains(searchText))
                        .ToList();
                }
                
                // Привязка списка отфильтрованных услуг, с проверкой на null
                ServicesList.ItemsSource = _filteredServices ?? new List<ServiceSkill>();
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка загрузки услуг: {ex.Message}");
                
                // В случае ошибки обеспечиваем безопасное состояние
                if (ServicesList != null) 
                {
                    ServicesList.ItemsSource = new List<ServiceSkill>();
                }
            }
        }
        
        private void ServiceSearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            try
            {
                // Безопасно получаем id выбранной категории
                int? categoryId = GetSelectedCategoryId();
                
                // Загружаем услуги с учетом поискового запроса и выбранной категории
                LoadServices(categoryId);
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка при поиске услуг: {ex.Message}");
                // Загружаем все услуги в случае ошибки
                LoadServices(null);
            }
        }
        
        private void CategoriesList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            try
            {
                // Безопасно получаем id выбранной категории
                int? categoryId = GetSelectedCategoryId();
                
                // Загружаем услуги для выбранной категории или все услуги, если категория не выбрана
                LoadServices(categoryId);
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка при выборе категории: {ex.Message}");
            }
        }
        
        private void SkillLevelComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (SkillLevelComboBox.SelectedIndex >= 0)
            {
                _selectedSkillLevel = SkillLevelComboBox.SelectedIndex + 1; // 1-based index (1, 2, 3)
                
                try
                {
                    // Обновить цены и длительность для выбранных услуг
                    UpdateSelectedServicesForSkillLevel();
                    
                    // Обновляем список всех доступных услуг в соответствии с уровнем мастера
                    _allServices = ConnectionDb.db.ServiceSkill
                        .Where(s => s.MastersSkills.skillId == _selectedSkillLevel)
                        .ToList();
                    
                    // Безопасно получаем id выбранной категории
                    int? categoryId = GetSelectedCategoryId();
                    
                    // Обновляем список услуг с учетом выбранной категории
                    LoadServices(categoryId);
                    
                    UpdateTotalSummary();
                }
                catch (Exception ex)
                {
                    Growl.Error($"Ошибка обновления услуг для уровня мастера: {ex.Message}");
                    // Загружаем все услуги в случае ошибки
                    LoadServices(null);
                }
            }
        }
        
        private void UpdateSelectedServicesForSkillLevel()
        {
            try
            {
                // Обновляем цены и длительность у уже выбранных услуг в соответствии с уровнем мастера
                for (int i = 0; i < _selectedServices.Count; i++)
                {
                    var serviceId = _selectedServices[i].serviceId;
                    var service = _allServices.FirstOrDefault(s => s.serviceId == serviceId);
                    
                    if (service != null)
                    {
                        // Обновить цену и длительность в зависимости от уровня мастера
                        switch (_selectedSkillLevel)
                        {
                            case 1: // Младший мастер
                                _selectedServices[i].price = service.Services.juniorPrice;
                                _selectedServices[i].runTime = service.Services.juniorRunTime;
                                break;
                            case 2: // Средний мастер
                                _selectedServices[i].price = service.Services.middlePrice;
                                _selectedServices[i].runTime = service.Services.middleRunTime;
                                break;
                            case 3: // Старший мастер
                                _selectedServices[i].price = service.Services.seniorPrice;
                                _selectedServices[i].runTime = service.Services.SeniorRunTime;
                                break;
                        }
                    }
                }
                
                // Обновить отображение - для ObservableCollection не нужно обновлять ItemsSource
                UpdateTotalSummary();
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка обновления услуг: {ex.Message}");
            }
        }
        
        private void ServicesList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Просто обновить состояние выбранного элемента
        }
        
        private void SelectedServicesList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Просто обновить состояние выбранного элемента
        }

        private void ServicesList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // Двойной клик по услуге добавляет её в выбранные
            if (ServicesList.SelectedItem is ServiceSkill selectedService)
            {
                AddServiceToSelected(selectedService);
            }
        }
        
        private void SelectedServicesList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // Двойной клик по выбранной услуге удаляет её из выбранных
            if (SelectedServicesList.SelectedItem is ServiceSkill selectedService)
            {
                RemoveServiceFromSelected(selectedService);
            }
        }
        
        private void AddServiceButton_Click(object sender, RoutedEventArgs e)
        {
            if (ServicesList.SelectedItem is ServiceSkill selectedService)
            {
                AddServiceToSelected(selectedService);
            }
            else
            {
                Growl.Warning("Выберите услугу для добавления");
            }
        }
        
        private void RemoveServiceButton_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedServicesList.SelectedItem is ServiceSkill selectedService)
            {
                RemoveServiceFromSelected(selectedService);
            }
            else
            {
                Growl.Warning("Выберите услугу для удаления");
            }
        }
        
        private void AddServiceToSelected(ServiceSkill service)
        {
            try
            {
                // Проверяем параметр
                if (service == null)
                {
                    Growl.Warning("Не выбрана услуга для добавления");
                    return;
                }
                
                // Проверяем, что _selectedServices инициализирован
                if (_selectedServices == null)
                {
                    _selectedServices = new ObservableCollection<ServiceSkill>();
                    SelectedServicesList.ItemsSource = _selectedServices;
                    ConfirmationServicesList.ItemsSource = _selectedServices;
                }
                
                // Проверяем, что услуга не выбрана уже
                if (!_selectedServices.Any(s => s.serviceId == service.serviceId))
                {
                    // Создаем копию услуги с учетом выбранного уровня мастера
                    var newService = new ServiceSkill
                    {
                        serviceId = service.serviceId,
                        skillId = service.skillId,
                        Services = service.Services,
                        MastersSkills = service.MastersSkills
                    };
                    
                    // Устанавливаем цену и длительность в зависимости от уровня мастера
                    if (service.Services != null)
                    {
                        switch (_selectedSkillLevel)
                        {
                            case 1: // Младший мастер
                                newService.price = service.Services.juniorPrice;
                                newService.runTime = service.Services.juniorRunTime;
                                break;
                            case 2: // Средний мастер
                                newService.price = service.Services.middlePrice;
                                newService.runTime = service.Services.middleRunTime;
                                break;
                            case 3: // Старший мастер
                                newService.price = service.Services.seniorPrice;
                                newService.runTime = service.Services.SeniorRunTime;
                                break;
                        }
                    }
                    
                    _selectedServices.Add(newService);
                    UpdateTotalSummary();
                }
                else
                {
                    Growl.Warning("Эта услуга уже добавлена");
                }
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка добавления услуги: {ex.Message}");
            }
        }
        
        private void RemoveServiceFromSelected(ServiceSkill service)
        {
            try
            {
                // Проверяем параметр
                if (service == null)
                {
                    Growl.Warning("Не выбрана услуга для удаления");
                    return;
                }
                
                // Проверяем, что _selectedServices инициализирован
                if (_selectedServices == null)
                {
                    _selectedServices = new ObservableCollection<ServiceSkill>();
                    SelectedServicesList.ItemsSource = _selectedServices;
                    ConfirmationServicesList.ItemsSource = _selectedServices;
                    return;
                }
                
                _selectedServices.Remove(service);
                UpdateTotalSummary();
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка удаления услуги: {ex.Message}");
            }
        }
        
        private void NextToDateButton_Click(object sender, RoutedEventArgs e)
        {
            if (_selectedServices.Count == 0)
            {
                Growl.Warning("Выберите хотя бы одну услугу");
                return;
            }
            
            // Переход ко второй вкладке
            TabControl.SelectedIndex = 1;
            // Установка соответствующего шага в StepBar
            Steps.StepIndex = 1;
        }
        
        #endregion
        
        #region Вторая вкладка: Выбор даты и мастера
        
        private void AppointmentDatePicker_SelectedDatesChanged(object sender, SelectionChangedEventArgs e)
        {
            _selectedDate = AppointmentDatePicker.SelectedDate;
            
            if (_selectedDate.HasValue)
            {
                // Загрузка доступных мастеров для выбранной даты и услуг
                LoadAvailableMasters();
            }
        }
        
        private void LoadAvailableMasters()
        {
            try
            {
                // Получаем TypeServiceId первой услуги (предполагается, что все услуги одного типа)
                var typeServiceId = _selectedServices.First().Services.typeServiceId;
                
                // Получаем skillId уровня квалификации мастера из ComboBox
                var skillId = _selectedSkillLevel;
                
                // Выбираем мастеров с нужной квалификацией и навыками
                _availableMasters = ConnectionDb.db.Masters
                    .Where(m => m.MastersQualifications.TypeServices.id == typeServiceId &&
                           m.MastersSkills.skillId == skillId)
                    .ToList();
                
                // Отфильтровываем мастеров, которые недоступны в выбранный день
                var selectedDate = _selectedDate.Value;
                var appointments = ConnectionDb.db.Appointments
                    .Where(a => DbFunctions.TruncateTime(a.date) == DbFunctions.TruncateTime(selectedDate))
                    .ToList();
                
                // Инициализация доступного времени для каждого мастера
                foreach (var master in _availableMasters)
                {
                    // Расчет доступных слотов времени для каждого мастера
                    var availableSlots = GetAvailableTimeSlots(master, selectedDate, _totalDuration);
                    
                    // Добавляем свойство AvailableTimeSlots к объекту мастера (динамически)
                    master.GetType().GetProperty("AvailableTimeSlots")?.SetValue(master, availableSlots);
                }
                
                // Вывод списка мастеров
                MastersList.ItemsSource = _availableMasters;
                
                // Сбрасываем выбранного мастера и время
                _selectedMaster = null;
                _selectedTimeSlot = null;
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка загрузки мастеров: {ex.Message}");
            }
        }
        
        private List<TimeSpan> GetAvailableTimeSlots(Masters master, DateTime date, int duration)
        {
            var availableSlots = new List<TimeSpan>();
            var startTime = new TimeSpan(9, 0, 0); // Начало рабочего дня
            var endTime = new TimeSpan(21, 0, 0);  // Конец рабочего дня
            var appointmentDuration = TimeSpan.FromMinutes(duration);
            
            // Получить все записи этого мастера на выбранную дату
            var appointments = ConnectionDb.db.Appointments
                .Where(a => a.Masters.masterId == master.masterId && 
                      DbFunctions.TruncateTime(a.date) == DbFunctions.TruncateTime(date))
                .ToList();
            
            // Создаем временные слоты с шагом 30 минут
            for (var time = startTime; time.Add(appointmentDuration) <= endTime; time = time.Add(TimeSpan.FromMinutes(30)))
            {
                bool isAvailable = true;
                
                // Проверяем, нет ли пересечений с существующими записями
                foreach (var appointment in appointments)
                {
                    if ((appointment.timeStart <= time && appointment.timeEnd > time) ||
                        (appointment.timeStart < time.Add(appointmentDuration) && 
                         appointment.timeEnd >= time.Add(appointmentDuration)) ||
                        (time <= appointment.timeStart && 
                         time.Add(appointmentDuration) >= appointment.timeStart))
                    {
                        isAvailable = false;
                        break;
                    }
                }

                if (isAvailable)
                {
                    availableSlots.Add(time);
                }
            }
            
            return availableSlots;
        }

        private void MastersList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (MastersList.SelectedItem is Masters selectedMaster)
            {
                _selectedMaster = selectedMaster;
                
                // Показать доступные слоты времени для выбранного мастера
                foreach (var item in MastersList.Items)
                {
                    if (item is Masters master)
                    {
                        // Находим ContentPresenter для этого элемента
                        var container = MastersList.ItemContainerGenerator.ContainerFromItem(master) as ListBoxItem;
                        if (container != null)
                        {
                            // Находим TimeSlotsPanel внутри шаблона
                            var timeSlotsPanel = FindVisualChild<StackPanel>(container, "TimeSlotsPanel");
                            
                            if (timeSlotsPanel != null)
                            {
                                // Показываем панель только для выбранного мастера
                                timeSlotsPanel.Visibility = (master == selectedMaster) 
                                    ? Visibility.Visible 
                                    : Visibility.Collapsed;
                                
                                // Если это выбранный мастер, загружаем доступные слоты
                                if (master == selectedMaster)
                                {
                                    var timeSlotsList = FindVisualChild<ItemsControl>(container, "TimeSlotsList");
                                    if (timeSlotsList != null)
                                    {
                                        // Получаем доступные слоты для выбранного мастера
                                        var availableSlots = GetAvailableTimeSlots(
                                            selectedMaster, 
                                            _selectedDate.Value, 
                                            _totalDuration);
                                            
                                        timeSlotsList.ItemsSource = availableSlots;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Вспомогательный метод для поиска дочернего элемента в визуальном дереве
        private T FindVisualChild<T>(DependencyObject parent, string name) where T : FrameworkElement
        {
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(parent); i++)
            {
                var child = VisualTreeHelper.GetChild(parent, i);
                
                if (child is T element && element.Name == name)
                    return element;
                
                var result = FindVisualChild<T>(child, name);
                if (result != null)
                    return result;
            }
            
            return null;
        }
        
        private void TimeSlotButton_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Content is TimeSpan timeSlot)
            {
                _selectedTimeSlot = timeSlot;
                
                // Выделяем выбранный слот времени
                foreach (var container in MastersList.ItemContainerGenerator.Items)
                {
                    if (container is Button timeButton)
                    {
                        timeButton.Background = (timeButton == button) 
                            ? new SolidColorBrush(Colors.LightBlue) 
                            : new SolidColorBrush(Colors.Transparent);
                    }
                }
            }
        }
        
        private void BackToServicesButton_Click(object sender, RoutedEventArgs e)
        {
            // Вернуться к первой вкладке
            TabControl.SelectedIndex = 0;
            // Установка соответствующего шага в StepBar
            Steps.StepIndex = 0;
        }
        
        private void NextToConfirmButton_Click(object sender, RoutedEventArgs e)
        {
            if (!_selectedDate.HasValue)
            {
                Growl.Warning("Выберите дату");
                return;
            }
            
            if (_selectedMaster == null)
            {
                Growl.Warning("Выберите мастера");
                return;
            }
            
            if (!_selectedTimeSlot.HasValue)
            {
                Growl.Warning("Выберите время");
                return;
            }
            
            // Загрузка данных для вкладки подтверждения
            LoadConfirmationData();
            
            // Переход к третьей вкладке
            TabControl.SelectedIndex = 2;
            // Установка соответствующего шага в StepBar
            Steps.StepIndex = 2;
        }
        
        private void BackToDateButton_Click(object sender, RoutedEventArgs e)
        {
            // Вернуться ко второй вкладке
            TabControl.SelectedIndex = 1;
            // Установка соответствующего шага в StepBar
            Steps.StepIndex = 1;
        }
        
        #endregion
        
        #region Третья вкладка: Подтверждение записи
        
        private void LoadConfirmationData()
        {
            try
            {
                // Данные клиента
                ClientLastNameText.Text = _selectedClient.Lname;
                ClientFirstNameText.Text = _selectedClient.FName;
                ClientPhoneText.Text = _selectedClient.phone;
                ClientEmailText.Text = _selectedClient.email;
                
                // Данные мастера
                MasterFullNameText.Text = $"{_selectedMaster.Lname} {_selectedMaster.Fname} {_selectedMaster.Patronymic}";
                MasterQualificationText.Text = _selectedMaster.MastersQualifications.TypeServices.name;
                MasterSkillText.Text = _selectedMaster.MastersSkills.name;
                
                // Данные записи
                AppointmentDateText.Text = _selectedDate.Value.ToString("dd.MM.yyyy");
                AppointmentStartTimeText.Text = _selectedTimeSlot.Value.ToString(@"hh\:mm");
                
                // Рассчитываем время окончания
                TimeSpan endTime = _selectedTimeSlot.Value.Add(TimeSpan.FromMinutes(_totalDuration));
                AppointmentEndTimeText.Text = endTime.ToString(@"hh\:mm");
                
                // Общая стоимость
                TotalPriceText.Text = $"{_totalPrice} ₽";
                
                // Для ObservableCollection нет необходимости обновлять ItemsSource
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка загрузки данных для подтверждения: {ex.Message}");
            }
        }
        
        private async void ConfirmAppointmentButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Создаем новую запись
                var appointment = new Appointments
                {
                    Clients = _selectedClient,
                    Masters = _selectedMaster,
                    date = _selectedDate.Value,
                    timeStart = _selectedTimeSlot.Value,
                    timeEnd = _selectedTimeSlot.Value.Add(TimeSpan.FromMinutes(_totalDuration)),
                    totalDuration = _totalDuration,
                    totalSum = _totalPrice,
                    statusId = 2 // Статус "Подтверждено"
                };
                
                // Добавляем запись в базу данных
                ConnectionDb.db.Appointments.Add(appointment);
                
                // Добавляем услуги для этой записи
                foreach (var service in _selectedServices)
                {
                    var appointmentService = new AppointmentsServices
                    {
                        Appointments = appointment,
                        Services = service.Services
                    };
                    
                    ConnectionDb.db.AppointmentsServices.Add(appointmentService);
                }
                
                // Сохраняем изменения
                ConnectionDb.db.SaveChanges();
                
                // Уведомляем пользователя
                Growl.Success("Запись успешно создана");
                
                // Обновляем список записей в родительском окне
                _owner.UpdateAppoinmentsList();
                
                // Закрываем диалог после небольшой задержки
                await Task.Delay(1500);
                this.Close();
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка создания записи: {ex.Message}");
            }
        }
        
        #endregion
        
        private void TabControl_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            try
            {
                if (TabControl == null || Steps == null)
                    return;
            
                // Получаем индекс выбранной вкладки
                int selectedIndex = TabControl.SelectedIndex;
            
                // Устанавливаем соответствующий шаг в StepBar
                Steps.StepIndex = selectedIndex;
            
            }
            catch (Exception ex)
            {
                Growl.Error($"Ошибка при смене вкладки: {ex.Message}");
            }
        }

        private void UpdateTotalSummary()
        {
            // Рассчитать общую стоимость и длительность для выбранных услуг
            _totalDuration = _selectedServices.Sum(s => s.runTime ?? 0);
            _totalPrice = _selectedServices.Sum(s => s.price ?? 0);
        }

        // Метод для безопасного получения id категории
        private int? GetSelectedCategoryId()
        {
            try
            {
                // Проверяем сам объект ComboBox
                if (CategoriesList == null)
                    return null;
            
                // Проверяем выбранный элемент
                var selectedItem = CategoriesList.SelectedItem;
                if (selectedItem == null)
                    return null;
            
                // Проверяем, является ли выбранный элемент TypeServices
                if (selectedItem is TypeServices typeService)
                {
                    // Если id = 0, это "Все категории", возвращаем null
                    if (typeService.id == 0)
                        return null;
                    else
                        return typeService.id;
                }
            
                return null;
            }
            catch
            {
                return null;
            }
        }
    }
}
