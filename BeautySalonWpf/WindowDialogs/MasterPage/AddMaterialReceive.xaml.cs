using BeautySalonWpf.Pages.Master;
using HandyControl.Controls;
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
using System.Windows.Shapes;

namespace BeautySalonWpf.WindowDialogs.MasterPage
{
    /// <summary>
    /// Логика взаимодействия для AddMaterialReceive.xaml
    /// </summary>
    public partial class AddMaterialReceive : System.Windows.Window
    {
        private MaterialsTab _owner;
        private Masters _master;
        private List<Products> _materials;
        public AddMaterialReceive(MaterialsTab owner, Masters master)
        {
            InitializeComponent();
            _owner = owner;
            _master = master;
            _materials  = ConnectionDb.db.Products.ToList();
            Materials.ItemsSource = _materials.Select(m => m.name);

        }

        private async void ConfirmAddBtn_Click(object sender, RoutedEventArgs e)
        {
            if(Materials.SelectedItem==null|| Count.Value == 0)
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            var request = new ProductReceiveRequest()
            {
                date = DateTime.Now,
                Masters = _master,
                Products = _materials.FirstOrDefault(m => m.name == Materials.SelectedItem.ToString()),
                count = (int)Count.Value
            };
            var product = ConnectionDb.db.Products.FirstOrDefault(p=>p.productId==request.Products.productId);
            if (product.inStock < request.count)
            {
                Growl.Error("На складе столько нет");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }
            product.inStock -= request.count;
            ConnectionDb.db.ProductReceiveRequest.Add(request);
            ConnectionDb.db.SaveChanges();
            _owner.UpdateProductsList();
            Growl.Success("Добавление прошло успешно");
            await Task.Delay(1500);
            Growl.Clear();

            this.Close();
        }

        private void CloseAddBtn_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
    }
}
