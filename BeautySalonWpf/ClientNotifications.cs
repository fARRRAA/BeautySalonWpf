//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан по шаблону.
//
//     Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//     Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BeautySalonWpf
{
    using System;
    using System.Collections.Generic;
    
    public partial class ClientNotifications
    {
        public int notificationId { get; set; }
        public string message { get; set; }
        public Nullable<System.DateTime> date { get; set; }
        public Nullable<int> clientReceiverid { get; set; }
    
        public virtual Clients Clients { get; set; }
    }
}
