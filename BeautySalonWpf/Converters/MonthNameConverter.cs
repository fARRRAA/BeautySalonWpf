using System;
using System.Globalization;
using System.Windows.Data;

namespace BeautySalonWpf
{
    public class MonthNameConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value == null)
                return string.Empty;

            if (value is int monthNumber)
            {
                switch (monthNumber)
                {
                    case 1: return "Январь";
                    case 2: return "Февраль";
                    case 3: return "Март";
                    case 4: return "Апрель";
                    case 5: return "Май";
                    case 6: return "Июнь";
                    case 7: return "Июль";
                    case 8: return "Август";
                    case 9: return "Сентябрь";
                    case 10: return "Октябрь";
                    case 11: return "Ноябрь";
                    case 12: return "Декабрь";
                    default: return string.Empty;
                }
            }

            return string.Empty;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
} 