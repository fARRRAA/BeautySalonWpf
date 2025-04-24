import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from '../Appointment.module.css';
import { AppointmentApiService } from '../../../api/AppointmentApiservice';
import { useAuth } from '../../../hooks/useAuth';

const appointmentApi = new AppointmentApiService();

const Confirmation = ({ onPrev, appointmentData }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

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

    const handleConfirm = async () => {
        try {
            setLoading(true);
            const bookingData = {
                masterId: appointmentData.masterId,
                timeStart: appointmentData.timeStart,
                timeEnd: appointmentData.timeEnd,
                totalSum: appointmentData.totalSum,
                totalDuration: appointmentData.totalDuration,
                date: appointmentData.date.toISOString().split('T')[0],
                clientId: currentUser.id
            };

            const response = await appointmentApi.createAppointment(bookingData);

            if (response) {
                toast.success('Запись успешно создана!');
                navigate('/profile');
            }
        } catch (error) {
            toast.error('Ошибка при создании записи');
            console.error('Error creating appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    const service = appointmentData.services[0];
    const skillLevel = service.skillLevels[0];

    return (
        <div className={styles.step_container}>
            <div className={styles.confirm_section}>
                <div className={styles.confirm_info}>
                    <h3 className={styles.info_title}>Информация о записи</h3>
                    <div className={styles.info_block}>
                        <div className={styles.info_row}>
                            <span className={styles.info_label}>Услуга:</span>
                            <span className={styles.info_value}>{service.name}</span>
                        </div>
                        <div className={styles.info_row}>
                            <span className={styles.info_label}>Уровень мастера:</span>
                            <span className={styles.info_value}>{skillLevel.name}</span>
                        </div>
                        <div className={styles.info_row}>
                            <span className={styles.info_label}>Дата:</span>
                            <span className={styles.info_value}>{formatDate(appointmentData.date)}</span>
                        </div>
                        <div className={styles.info_row}>
                            <span className={styles.info_label}>Время:</span>
                            <span className={styles.info_value}>
                                {formatTime(appointmentData.timeStart)} - {formatTime(appointmentData.timeEnd)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.confirm_summary}>
                    <h3 className={styles.info_title}>Итого</h3>
                    <div className={styles.summary_block}>
                        <div className={styles.total_row}>
                            <span className={styles.total_label}>Стоимость услуги:</span>
                            <span className={styles.total_value}>{appointmentData.totalSum} ₽</span>
                        </div>
                        <div className={styles.total_row}>
                            <span className={styles.total_label}>Длительность:</span>
                            <span className={styles.total_value}>{appointmentData.totalDuration} мин</span>
                        </div>
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
    );
};

export default Confirmation; 