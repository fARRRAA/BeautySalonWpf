﻿using BeautySalonApi.Models;

namespace BeautySalonApi.Services.ServicesService
{
    public interface IServicesService
    {
        public List<ServicesGroup> GetAll();
        public List<ServiceSkill> GetAllSkill();
    }
}
