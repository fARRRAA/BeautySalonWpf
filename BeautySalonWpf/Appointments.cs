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
    
    public partial class Appointments
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Appointments()
        {
            this.AppointmentsServices = new HashSet<AppointmentsServices>();
        }
    
        public int id { get; set; }
        public Nullable<int> masterId { get; set; }
        public Nullable<System.TimeSpan> timeStart { get; set; }
        public Nullable<System.TimeSpan> timeEnd { get; set; }
        public Nullable<int> totalSum { get; set; }
        public Nullable<int> totalDuration { get; set; }
        public Nullable<int> statusId { get; set; }
        public Nullable<System.DateTime> date { get; set; }
        public Nullable<int> clientId { get; set; }
    
        public virtual AppointmentStatus AppointmentStatus { get; set; }
        public virtual Clients Clients { get; set; }
        public virtual Masters Masters { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AppointmentsServices> AppointmentsServices { get; set; }
    }
}
