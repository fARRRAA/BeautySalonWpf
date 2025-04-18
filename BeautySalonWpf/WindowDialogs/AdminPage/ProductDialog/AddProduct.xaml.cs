﻿using BeautySalonWpf.Pages.Admin.Tabs;
using HandyControl.Controls;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
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

namespace BeautySalonWpf.WindowDialogs.AdminPage.ProductDialog
{

    public partial class AddProduct : System.Windows.Window
    {
        private ProductsTab _owner;
        private List<TypeProducts> typeProducts = ConnectionDb.db.TypeProducts.ToList();
        private BeautySalonWpf.Products _product = new BeautySalonWpf.Products();
        public AddProduct(ProductsTab owner)
        {
            InitializeComponent();
            _owner = owner;
            typeText.ItemsSource = typeProducts.Select(p=>p.name);
        }

        private async void addBtn_Click(object sender, RoutedEventArgs e)
        {
            var inputs = new[]
              {
        NameText.Text,
        PriceText.Text,
        typeText.SelectedItem.ToString(),

                };

            if (inputs.Any(string.IsNullOrWhiteSpace))
            {
                Growl.Error("Заполните все поля");
                await Task.Delay(1500);
                Growl.Clear();
                return;
            }

            try
            {
                _product.name = NameText.Text;
                _product.price = Convert.ToInt32(PriceText.Text);
                _product.TypeProducts = typeProducts.FirstOrDefault(t => t.name == typeText.SelectedItem.ToString());
                _product.photo = "";
                _product.inStock = 0;
                _product.soldCount = 0;
                ConnectionDb.db.Products.Add(_product);
                ConnectionDb.db.SaveChanges();
                Growl.Success("Добавление прошло успешно");
                await Task.Delay(1000);
                Growl.Clear();
                _owner.UpdateProductsList();
                this.Close();
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
    }
}
