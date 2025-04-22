import s from './Services.module.css'
import { useEffect, useState } from 'react';
import { ServicesApiService } from '../../../api/ServicesApiService';

const serviceImages = {
    1: "/src/assets/imgs/hairstyle.png", 
    2: "/src/assets/imgs/manicure.png",     
    3: "/src/assets/imgs/cosmetology.png",  
    6: "/src/assets/imgs/makeup.png",  
    7: "/src/assets/imgs/massage.png" 
};

export function Services() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const api = new ServicesApiService();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const result = await api.getServices();

                setData(result);
            } catch (err) {
                setError(err);
                console.error('Error fetching services:', err);
            }
        };
        fetchServices();
    }, []);

    // let ids = [1, 2, 3, 6, 7];
    // const groupedServices = data.reduce((acc, service) => {
    //     const typeId = service.typeServiceId;
    //     if (!ids.includes(typeId)) return acc;
    //     if (!acc[typeId]) {
    //         acc[typeId] = {
    //             id: service.typeServices.id,
    //             name: service.typeServices.name,
    //             services: [],
    //         };
    //     }
    //     acc[typeId].services.push(service);
    //     return acc;
    // }, {});

    if (error) {
        return <div>Произошла ошибка при загрузке услуг</div>;
    }

    return (
        <div className={s.services}>
            <div className="container">
                <div className={s.services_inner}>
                    <h1 className={s.services_title}>Услуги и цены</h1>
                    <p className={s.services_subtitle}>
                        Мы предлагаем широкий спектр услуг для красоты и ухода за собой
                    </p>
                    <div className={s.services_wrapper}>
                        {data.map((group, index) => (
                            <div key={group.id} className={s.service_group}>
                                <div className={`${s.service_section} ${index % 2 === 1 ? s.even : ''}`}>
                                    <img 
                                        src={serviceImages[group.id]} 
                                        alt={group.name}
                                        className={s.service_image}
                                    />
                                    <div className={s.service_list}>
                                    <h2 className={s.group_title}>{group.name}</h2>
                                        {group.services.map((service) => (
                                            <div key={service.serviceId} className={s.service_item}>
                                                <span className={s.service_name}>
                                                    {service.serviceName}
                                                </span>
                                                <span className={s.service_price}>
                                                    от {service.juniorPrice} ₽
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* {Object.values(groupedServices).map((group, index) => (
                            <div key={group.id} className={s.service_group}>
                                <div className={`${s.service_section} ${index % 2 === 1 ? s.even : ''}`}>
                                    <img 
                                        src={serviceImages[group.id]} 
                                        alt={group.name}
                                        className={s.service_image}
                                    />
                                    <div className={s.service_list}>
                                    <h2 className={s.group_title}>{group.name}</h2>
                                        {group.services.map((service) => (
                                            <div key={service.serviceId} className={s.service_item}>
                                                <span className={s.service_name}>
                                                    {service.serviceName}
                                                </span>
                                                <span className={s.service_price}>
                                                    от {service.juniorPrice} ₽
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>
        </div>
    );
}