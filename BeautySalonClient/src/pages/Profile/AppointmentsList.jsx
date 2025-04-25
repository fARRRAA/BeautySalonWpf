import React, { useEffect, useState } from 'react';
import { AppointmentApiService } from '../../api/AppointmentApiservice';
import s from './Profile.module.css';
import { successMsg, errorMsg } from '../../messages/mesages';

export function AppointmentsList({ userId }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const appointmentApi = new AppointmentApiService();

    useEffect(() => {
        fetchAppointments();
    }, [userId]);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentApi.getAppointmentsByClient(userId);
            setAppointments(data);
        } catch (error) {
            console.error('Ошибка при загрузке записей:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        try {
            await appointmentApi.cancelAppointment(appointmentId);
            successMsg('Запись успешно отменена');
            fetchAppointments(); 
        } catch (error) {
            console.error('Ошибка при отмене записи:', error);
            errorMsg('Не удалось отменить запись');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString.slice(0, 5);
    };

    if (loading) return <div className={s.loading}>Загрузка записей...</div>;

    return (
        <div className={s.appointments_list}>
            <h2 className={s.group_title}>Мои записи</h2>
            {appointments.length === 0 ? (
                <p className={s.no_appointments}>У вас пока нет записей</p>
            ) : (
                appointments.map(({ appointment, appointmentServices }) => (
                    <div key={appointment.id} className={s.appointment_card}>
                        <div className={s.appointment_header}>
                            <div className={s.appointment_date}>
                                {formatDate(appointment.date)}
                            </div>

                            <div className={`${s.appointment_status} ${appointment.statusId==3 ?  s.cancelled  : ''}`}>
                                {appointment.appointmentStatus.name}
                            </div>
                        </div>

                        <div className={s.appointment_master}>
                            <img 
                                src={appointment.masters.photo} 
                                alt={`${appointment.masters.lname} ${appointment.masters.fname}`}
                                className={s.master_photo}
                            />
                            <div className={s.master_info}>
                                <div className={s.master_name}>
                                    {appointment.masters.lname} {appointment.masters.fname} {appointment.masters.patronymic}
                                </div>
                                <div className={s.master_qualification}>
                                    {appointment.masters.mastersSkills.name}
                                </div>
                            </div>
                        </div>

                        <div className={s.appointment_time}>
                            <div className={s.time_slot}>
                                <span>Начало:</span> {formatTime(appointment.timeStart)}
                            </div>
                            <div className={s.time_slot}>
                                <span>Окончание:</span> {formatTime(appointment.timeEnd)}
                            </div>
                        </div>

                        <div className={s.services_list}>
                            {appointmentServices.map(service => (
                                <div key={service.id} className={s.service_item}>
                                    <span className={s.service_name}>
                                        {service.services.serviceName}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className={s.appointment_footer}>
                            <div className={s.appointment_total}>
                                <span>Итого:</span> {appointment.totalSum} ₽
                            </div>
                            {appointment.statusId === 2 && ( // Проверяем, что статус "Создан"
                                <button 
                                    className={s.cancel_button}
                                    onClick={() => handleCancel(appointment.id)}
                                >
                                    Отменить запись
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
} 