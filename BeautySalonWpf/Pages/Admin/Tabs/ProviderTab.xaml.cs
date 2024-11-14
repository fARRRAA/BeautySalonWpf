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

namespace BeautySalonWpf.Pages.Admin.Tabs
{
    /// <summary>
    /// Логика взаимодействия для ProviderTab.xaml
    /// </summary>
    public partial class ProviderTab : Page
    {
        private List<Provider> _providers;
        private int pageCount;
        private int pageSize = 12;
        public ProviderTab()
        {

            InitializeComponent();      
            _providers = ConnectionDb.db.Provider.ToList();
            ProvidersList.ItemsSource = _providers.Take(pageSize);
            pageCount = (int)Math.Round(Convert.ToDouble(_providers.Count / pageSize)) + 1;
            paginationElem.MaxPageCount = pageCount;
            ProvidersCountText.Content = $"Всего поставщиков: {_providers.Count}";
        }

        private void deleteProvider_Click(object sender, RoutedEventArgs e)
        {

        }
        private void ProviderSearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            var searchText = ProviderSearchText.Text.ToLower();
            var filtered = _providers.Where(a => a.name.ToLower().Contains(searchText)
            || a.name.ToLower().Contains(searchText)
            || a.INN.ToLower().Contains(searchText)
            ||a.phone.ToLower().Contains(searchText)
            ).ToList();
            ProvidersList.ItemsSource = filtered;
        }
        private void redactProvider_Click(object sender, RoutedEventArgs e)
        {

        }
        private void page_PageUpdated(object sender, HandyControl.Data.FunctionEventArgs<int> e)
        {
            ProvidersList.ItemsSource = _providers.Skip((e.Info - 1) * pageSize).Take(pageSize).ToList();
        }
        private void addProvider_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
