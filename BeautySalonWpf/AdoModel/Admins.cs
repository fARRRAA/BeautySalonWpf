//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан по шаблону.
//
//     Изменения, вносимые в этот файл вручную, могут привести к непредвиденной работе приложения.
//     Изменения, вносимые в этот файл вручную, будут перезаписаны при повторном создании кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BeautySalonWpf.AdoModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class Admins
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Admins()
        {
            this.AdminNotifications = new HashSet<AdminNotifications>();
        }
    
        public int adminId { get; set; }
        public string Lname { get; set; }
        public string Fname { get; set; }
        public string Patronymic { get; set; }
        public Nullable<System.DateTime> dateBirth { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public string photo { get; set; }
        public Nullable<int> roleId { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AdminNotifications> AdminNotifications { get; set; }
        public virtual Roles Roles { get; set; }
    }
}
