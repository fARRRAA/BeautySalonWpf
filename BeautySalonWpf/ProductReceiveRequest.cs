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
    
    public partial class ProductReceiveRequest
    {
        public int requestId { get; set; }
        public Nullable<int> masterId { get; set; }
        public Nullable<int> productId { get; set; }
        public Nullable<int> count { get; set; }
    
        public virtual Masters Masters { get; set; }
        public virtual Products Products { get; set; }
    }
}
