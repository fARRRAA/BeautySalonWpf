import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './Confirmation.module.css';
import { AppointmentApiService } from '../../../api/AppointmentApiservice';
import { useAuth } from '../../../hooks/useAuth';
import { AuthApiService } from '../../../api/AuthApiService';
import { successMsg } from '../../../messages/mesages';
const appointmentApi = new AppointmentApiService();
const userApi = new AuthApiService();

const Confirmation = ({ onPrev, appointmentData }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const currentUser = useAuth();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const getUser = async () => {
            var user = await userApi.getUserByEmail(currentUser.email);
            setUser(user);
        };
        getUser();
    }, [])

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return time.slice(0, 5);
    };

    const formatPrice = (price) => {
        return `${price.toLocaleString('ru-RU')} ₽`;
    };

    // Рассчитываем общую стоимость и длительность
    const totalSum = appointmentData.services.reduce((sum, service) => sum + service.skillLevel.price, 0);
    const totalDuration = appointmentData.services.reduce((sum, service) => sum + service.skillLevel.duration, 0);

    // Вычисляем время окончания
    const calculateEndTime = () => {
        const [hours, minutes] = appointmentData.timeStart.split(':');
        const startTime = new Date(appointmentData.date);
        startTime.setHours(parseInt(hours), parseInt(minutes), 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + totalDuration);

        return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:00`;
    };

    const handleConfirm = async () => {
        // Создаем дату с временем с учетом часового пояса
        const [hours, minutes] = appointmentData.timeStart.slice(0, -3).split(':');
        const appointmentDateTime = new Date(appointmentData.date);
        appointmentDateTime.setMinutes(appointmentDateTime.getMinutes() - appointmentDateTime.getTimezoneOffset());
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

        let app = {
            masterId: appointmentData.masterId,
            timeStart: appointmentData.timeStart.slice(0,-3),
            timeEnd: calculateEndTime(),
            totalSum: totalSum,
            totalDuration: totalDuration,
            date: appointmentDateTime.toISOString(),
            clientId: currentUser.id,
            services: appointmentData.services
        }
        console.log(app)
        try {
            setLoading(true);
            const res = await fetch('https://localhost:7165/api/Appointments/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(app)
            });
            if (res) {
                successMsg('Вы успешно записаны');
                setTimeout(() => navigate("/user/profile"), 1500);
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error(error.res?.data?.message || 'Ошибка при создании записи');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.step_container}>
            <div className={styles.step_wrapper}>
                <div className={styles.confirm_section}>
                    <div className={styles.confirm_info}>
                        <h3 className={styles.info_title}>Информация о клиенте</h3>
                        {
                            user ?
                                <div className={styles.info_block}>
                                    <div className={styles.info_row}>
                                        <span className={styles.info_label}>Фамилия:</span>
                                        <span className={styles.info_value}>{user.lname}</span>

                                    </div>
                                    <div className={styles.info_row}>
                                        <span className={styles.info_label}>Имя:</span>
                                        <span className={styles.info_value}>{user.fName}</span>
                                    </div>
                                    <div className={styles.info_row}>
                                        <span className={styles.info_label}>Email:</span>
                                        <span className={styles.info_value}>{user.email}</span>
                                    </div>
                                    <div className={styles.info_row}>
                                        <span className={styles.info_label}>Телефон:</span>
                                        <span className={styles.info_value}>{user.phone}</span>
                                    </div>
                                </div> : <p>загрузка данных</p>
                        }
                        <h3 className={styles.info_title} style={{ marginTop: '20px' }}>Информация о записи</h3>
                        <div className={styles.info_block}>
                            <div className={styles.info_row}>
                                <span className={styles.info_label}>Дата:</span>
                                <span className={styles.info_value}>{formatDate(appointmentData.date)}</span>
                            </div>
                            <div className={styles.info_row}>
                                <span className={styles.info_label}>Время начала:</span>
                                <span className={styles.info_value}>{formatTime(appointmentData.timeStart)}</span>
                            </div>
                            <div className={styles.info_row}>
                                <span className={styles.info_label}>Время окончания:</span>
                                <span className={styles.info_value}>{formatTime(calculateEndTime())}</span>
                            </div>
                        </div>

                        <h3 className={styles.info_title} style={{ marginTop: '20px' }}>Выбранные услуги</h3>
                        <div className={styles.info_block}>
                            {appointmentData.services.map((service, index) => (
                                <div key={index} className={styles.info_row}>
                                    <span className={styles.info_label}>{service.name}</span>
                                    <span className={styles.info_value}>
                                        {formatPrice(service.skillLevel.price)}
                                        <span style={{ fontSize: '0.8em', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                                            ({service.skillLevel.duration} мин)
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`${styles.confirm_section} ${styles.summary}`}>
                    <div className={styles.confirm_summary}>
                        <h3 className={styles.info_title}>Итого</h3>
                        <div className={styles.summary_block}>
                            <div className={styles.total_row}>
                                <span className={styles.total_label}>Общая стоимость:</span>
                                <span className={styles.total_value}>{formatPrice(totalSum)}</span>
                            </div>
                            <div className={styles.total_row}>
                                <span className={styles.total_label}>Общая длительность:</span>
                                <span className={styles.total_value}>{totalDuration} мин</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.button_group}>
                        <button
                            className={`${styles.button} ${styles.button_secondary}`}
                            onClick={onPrev}
                            disabled={loading}
                        >
                            Назад
                        </button>
                        <button
                            className={`${styles.button} ${styles.button_primary}`}
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? 'Создание записи...' : 'Подтвердить запись'}
                        </button>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Confirmation; 