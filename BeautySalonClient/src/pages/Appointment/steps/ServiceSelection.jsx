import React, { useState, useEffect } from 'react';
import styles from '../Appointment.module.css';
import { ServicesApiService } from '../../../api/ServicesApiService';
import { errorMsg, successMsg, warningMsg } from '../../../messages/mesages';
import { toast, ToastContainer } from 'react-toastify';

const serviceApi = new ServicesApiService();

const ServiceSelection = ({ onNext, appointmentData }) => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState(
        appointmentData?.services?.map(service => ({
            id: service.serviceId,
            name: service.name,
            skillId: service.skillLevel.name,
            category: service.category,
            levels: {
                1: {
                    price: service.skillLevel.price,
                    duration: service.skillLevel.duration
                },
                2: {
                    price: service.skillLevel.price,
                    duration: service.skillLevel.duration
                },
                3: {
                    price: service.skillLevel.price,
                    duration: service.skillLevel.duration
                }
            }
        })) || []
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(
        appointmentData?.services?.[0]?.category || null
    );
    const [selectedSkillLevel, setSelectedSkillLevel] = useState(
        appointmentData?.services?.[0]?.skillLevel?.name || 1
    );

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await serviceApi.getAll();
                const groupedServices = data.reduce((acc, item) => {
                    if (!acc[item.serviceId]) {
                        acc[item.serviceId] = {
                            id: item.serviceId,
                            name: item.service.name,
                            category: {
                                id: item.typeService.id,
                                name: item.typeService.name
                            },
                            levels: {
                                1: {
                                    price: item.service.juniorPrice,
                                    duration: item.service.juniorRunTime
                                },
                                2: {
                                    price: item.service.middlePrice,
                                    duration: item.service.middleRunTime
                                },
                                3: {
                                    price: item.service.seniorPrice,
                                    duration: item.service.seniorRunTime
                                }
                            }
                        };
                    }
                    return acc;
                }, {});

                const uniqueCategories = Array.from(
                    new Set(data.map(item => item.typeService.id))
                ).map(categoryId => {
                    const service = data.find(item => item.typeService.id === categoryId);
                    return {
                        id: categoryId,
                        name: service.typeService.name
                    };
                });

                setServices(Object.values(groupedServices));
                setCategories(uniqueCategories);

                // Если есть сохраненная категория, установим её
                if (appointmentData?.services?.[0]?.category) {
                    const savedCategory = uniqueCategories.find(
                        cat => cat.id === appointmentData.services[0].category.id
                    );
                    if (savedCategory) {
                        setSelectedCategory(savedCategory);
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [appointmentData]);

    const handleServiceSelect = (service) => {
        setSelectedServices(prev => {
            const isSelected = prev.some(s => s.id === service.id);
            
            if (isSelected) {
                return prev.filter(s => s.id !== service.id);
            }
            
            if (prev.length === 0 || prev[0].category.id === service.category.id) {
                return [...prev, {
                    ...service,
                    skillId: selectedSkillLevel
                }];
            } else {
                const currentCategory = prev[0].category.name;
                errorMsg(`Можно выбирать услуги только из одной категории.`,1500);
                return prev;
            }
        });
    };

    const handleSkillLevelChange = (level) => {
        setSelectedSkillLevel(level);
        setSelectedServices(prev => prev.map(service => ({
            ...service,
            skillId: level
        })));
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleNext = () => {
        if (selectedServices.length === 0) {
            warningMsg('Пожалуйста, выберите хотя бы одну услугу',2000);
            return;
        }

        const servicesData = selectedServices.map(service => ({
            serviceId: service.id,
            name: service.name,
            category: service.category,
            skillLevel: {
                name: service.skillId,
                price: service.levels[service.skillId].price,
                duration: service.levels[service.skillId].duration
            }
        }));

        onNext({ services: servicesData });
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || service.category.id === selectedCategory.id;
        return matchesSearch && matchesCategory;
    });

    const skillLevelNames = {
        1: 'Младший мастер',
        2: 'Средний мастер',
        3: 'Старший мастер'
    };
    return (
        <>
            <div className={styles.step_container}>
                <div className={styles.search_bar}>
                    <input
                        type="text"
                        placeholder="Поиск услуг..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.search_input}
                    />
                </div>

                <div className={styles.categories}>
                    <div
                        className={`${styles.category_item} ${!selectedCategory ? styles.selected : ''}`}
                        onClick={() => handleCategorySelect(null)}
                    >
                        Все услуги
                    </div>
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className={`${styles.category_item} ${selectedCategory?.id === category.id ? styles.selected : ''}`}
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>

                <div className={styles.skill_level_selector}>
                    <select 
                        value={selectedSkillLevel}
                        onChange={(e) => handleSkillLevelChange(e.target.value)}
                        className={styles.skill_level_select}
                    >
                        {Object.entries(skillLevelNames).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.list_container}>
                    <div className={styles.list_area}>
                        <h3 className={styles.info_title}>
                            {selectedCategory ? `Услуги - ${selectedCategory.name}` : 'Все услуги'}
                        </h3>
                        <div className={styles.list_box}>
                            {loading ? (
                                <div>Загрузка...</div>
                            ) : filteredServices.length > 0 ? (
                                filteredServices.map(service => (
                                    
                                    <div
                                        key={service.id}
                                        className={`${styles.list_item} ${selectedServices.some(s => s.id === service.id) ? styles.selected : ''}`}
                                        onClick={() => handleServiceSelect(service)}
                                    >
                                        <div className={styles.service_name}>{service.name}</div>
                                        <div className={styles.service_info}>
                                            Цена: {service.levels[selectedSkillLevel].price} ₽
                                            <br />
                                            Длительность: {service.levels[selectedSkillLevel].duration} мин
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>Услуги не найдены</div>
                            )}
                        </div>
                    </div>

                    <div className={styles.list_area}>
                        <h3 className={styles.info_title}>Выбранные услуги</h3>
                        <div className={styles.list_box}>
                            {selectedServices.length > 0 ? (
                                selectedServices.map(service => (
                                    <div
                                        key={service.id}
                                        className={`${styles.list_item} ${styles.selected}`}
                                        onClick={() => handleServiceSelect(service)}
                                    >
                                        <div className={styles.service_name}>{service.name}</div>
                                        <div className={styles.service_info}>
                                            Уровень мастера: {skillLevelNames[service.skillId]}
                                            <br />
                                            Цена: {service.levels[service.skillId].price} ₽
                                            <br />
                                            Длительность: {service.levels[service.skillId].duration} мин
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.no_services_selected}>
                                    Услуги не выбраны
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.button_group}>
                    <button
                        className={`${styles.button} ${styles.button_primary}`}
                        onClick={handleNext}
                    >
                        Далее
                    </button>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default ServiceSelection; 