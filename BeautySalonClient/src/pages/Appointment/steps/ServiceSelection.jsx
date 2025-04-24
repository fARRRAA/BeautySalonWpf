import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '../Appointment.module.css';
import { ServicesApiService } from '../../../api/ServicesApiService';

const serviceApi = new ServicesApiService();

const ServiceSelection = ({ onNext }) => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSkillLevels, setSelectedSkillLevels] = useState({});

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await serviceApi.getAll();

            const groupedServices = data.reduce((acc, item) => {
                if (!acc[item.serviceId]) {
                    acc[item.serviceId] = {
                        id: item.serviceId,
                        name: item.service.name,
                        description: `От ${item.service.juniorPrice} ₽`,
                        category: {
                            id: item.typeService.id,
                            name: item.typeService.name
                        },
                        skillLevels: []
                    };
                }
                acc[item.serviceId].skillLevels.push({
                    id: item.skillId,
                    name: item.skillLevel.name,
                    price: item.price,
                    duration: item.duration
                });
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
        } catch (error) {
            toast.error('Ошибка при загрузке услуг');
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };
console.log(selectedSkillLevels);
    const handleServiceSelect = (service) => {
        setSelectedServices(prev => {
            const isSelected = prev.some(s => s.id === service.id);
            if (isSelected) {
                // Удаляем услугу и её уровень мастера
                setSelectedSkillLevels(prevLevels => {
                    const newLevels = { ...prevLevels };
                    delete newLevels[service.id];
                    return newLevels;
                });
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const handleSkillLevelSelect = (serviceId, skillLevel) => {
        setSelectedSkillLevels(prev => ({
            ...prev,
            [serviceId]: skillLevel
        }));
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleNext = () => {
        if (selectedServices.length === 0) {
            toast.warning('Пожалуйста, выберите хотя бы одну услугу');
            return;
        }

        // Проверяем, что для каждой выбранной услуги выбран уровень мастера
        const allServicesHaveSkillLevels = selectedServices.every(
            service => selectedSkillLevels[service.id]
        );

        if (!allServicesHaveSkillLevels) {
            toast.warning('Пожалуйста, выберите уровень мастера для каждой услуги');
            return;
        }

        const servicesData = selectedServices.map(service => ({
            serviceId: service.id,
            name: service.name,
            skillLevel: selectedSkillLevels[service.id]
        }));

        onNext({ services: servicesData });
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || service.category.id === selectedCategory.id;
        return matchesSearch && matchesCategory;
    });

    return (
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
                                        {service.description}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>Услуги не найдены</div>
                        )}
                    </div>
                </div>

                <div className={styles.list_area}>
                    <h3 className={styles.info_title}>Уровни мастеров</h3>
                    <div className={styles.skill_levels}>
                        {selectedServices.map(service => (
                            <div key={service.id} className={styles.selected_service_container}>
                                <h4 className={styles.selected_service_name}>{service.name}</h4>
                                <div className={styles.skill_level_list}>
                                    {service.skillLevels.map(level => (
                                        <div
                                            key={level.id}
                                            className={`${styles.skill_item} ${selectedSkillLevels[service.id]?.id === level.id ? styles.selected : ''}`}
                                            onClick={() => handleSkillLevelSelect(service.id, level)}
                                        >
                                            <h4>{level.name}</h4>
                                            <div className={styles.skill_info}>
                                                <span>Цена: {level.price} ₽</span>
                                                <span>Длительность: {level.duration} мин</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {selectedServices.length === 0 && (
                            <div className={styles.no_services_selected}>
                                Выберите услуги из списка слева
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
        </div>
    );
};

export default ServiceSelection; 