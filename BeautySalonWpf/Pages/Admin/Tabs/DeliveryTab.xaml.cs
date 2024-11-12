using BeautySalonWpf.WindowDialogs.AdminPage.DeliveryDialogs;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace BeautySalonWpf.Pages.Admin.Tabs
{
    /// <summary>
    /// Логика взаимодействия для DeliveryTav.xaml
    /// </summary>
    public partial class DeliveryTab : Page
    {
        private List<Delivery> _deliveries;
        private int pageCount;
        private int pageSize = 12;
        public DeliveryTab()
        {
            InitializeComponent();
            _deliveries = ConnectionDb.db.Delivery.ToList();
            DeliveryList.ItemsSource = _deliveries;
            pageCount = (int)Math.Round(Convert.ToDouble(_deliveries.Count / pageSize)) + 1;
            paginationElem.MaxPageCount = pageCount;
            DeliveriesCountText.Content = $"Всего поставок: {_deliveries.Count}";
        }
        private void DeliverySearchText_TextChanged(object sender, TextChangedEventArgs e)
        {
            var searchText = DeliverySearchText.Text.ToLower();
            var filtered = _deliveries.Where(a => a.Provider.name.ToLower().Contains(searchText)
            || a.Products.name.ToLower().Contains(searchText)
            ).ToList();
            DeliveryList.ItemsSource = filtered;
        }

        private void deleteDelivery_Click(object sender, RoutedEventArgs e)
        {

        }

        private void redactDelivery_Click(object sender, RoutedEventArgs e)
        {
            if (DeliveryList.SelectedItems == null)
            {
                Growl.Error("выберите поставку");
            }
        }

        private void addDelivery_Click(object sender, RoutedEventArgs e)
        {
            var AddDeliveryDialog = new AddDelivery(this);
            AddDeliveryDialog.Show();
        }
        private void page_PageUpdated(object sender, HandyControl.Data.FunctionEventArgs<int> e)
        {
            DeliveryList.ItemsSource = _deliveries.Skip((e.Info - 1) * pageSize).Take(pageSize).ToList();
        }
        public async void UpdateDeliveryList()
        {
            var newItems = await ConnectionDb.db.Delivery.ToListAsync();
            DeliveryList.ItemsSource = newItems.Take(9);
            _deliveries = newItems;
            DeliveriesCountText.Content = $"Всего поставок: {newItems.Count}";
        }

        private void DeliverySearchText_TextChanged_1(object sender, TextChangedEventArgs e)
        {

        }
    }
}
