import React, { useEffect, useState } from 'react';
import { AppointmentApiService } from '../../api/AppointmentApiservice';
import styles from './Profile.module.css';
import { successMsg, errorMsg } from '../../messages/mesages';
import { Spin, Empty, Collapse, Badge, Tag, Divider } from 'antd';
import { CalendarOutlined, CaretRightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

export function AppointmentsList({ userId }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const appointmentApi = new AppointmentApiService();

    useEffect(() => {
        if (userId) {
            fetchAppointments();
        }
    }, [userId]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentApi.getAppointmentsByClient(userId);
            setAppointments(data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке записей:', error);
            setError('Ошибка при загрузке записей');
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
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        return timeString.slice(0, 5);
    };

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1: // Ожидает подтверждения
                return 'blue';
            case 2: // Создан
                return 'green';
            case 3: // Отменен
                return 'red';
            case 4: // Завершен
                return 'purple';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <div className={styles.loading_container}>
                <Spin size="large" />
                <p>Загрузка записей...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error_message}>{error}</div>;
    }

    if (!appointments || appointments.length === 0) {
        return (
            <div className={styles.no_orders}>
                <Empty
                    description="У вас пока нет записей"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <p>Вы можете записаться на услуги в нашем салоне красоты</p>
            </div>
        );
    }

    return (
        <div className={styles.orders_container}>
            <h2 className={styles.orders_title}>
                <CalendarOutlined /> История записей
            </h2>
            <p className={styles.orders_subtitle}>Всего записей: {appointments.length}</p>

            <Collapse
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className={styles.orders_collapse}
            >
                {appointments.map(({ appointment, appointmentServices }) => (
                    <Panel
                        key={appointment.id}
                        header={
                            <div className={styles.order_header}>
                                <span className={styles.order_id}>
                                    Запись #{appointment.id}
                                </span>
                                <span className={styles.order_date}>
                                    {formatDate(appointment.date)}
                                </span>
                                <span className={styles.order_sum}>
                                    {appointment.totalSum} ₽
                                </span>
                                <Tag color={getStatusColor(appointment.statusId)}>
                                    {appointment.appointmentStatus.name}
                                </Tag>
                            </div>
                        }
                        className={styles.order_panel}
                    >
                        <div className={styles.order_details}>
                            <div className={styles.order_info}>
                                <div className={styles.order_info_item}>
                                    <span className={styles.info_label}>Статус записи:</span>
                                    <Tag color={getStatusColor(appointment.statusId)} style={{width:'100px',textAlign:'center'}}>
                                        {appointment.appointmentStatus.name}
                                    </Tag>
                                </div>
                                <div className={styles.order_info_item}>
                                    <span className={styles.info_label}>Время:</span>
                                    <span>{formatTime(appointment.timeStart)} - {formatTime(appointment.timeEnd)}</span>
                                </div>
                                <div className={styles.order_info_item}>
                                    <span className={styles.info_label}>Длительность:</span>
                                    <span>{appointment.totalDuration} мин.</span>
                                </div>
                                <div className={styles.order_info_item}>
                                    <span className={styles.info_label}>Стоимость:</span>
                                    <span className={styles.order_sum_value}>{appointment.totalSum} ₽</span>
                                </div>
                            </div>

                            <Divider orientation="left">Мастер</Divider>
                            
                            <div className={styles.product_item} style={{marginBottom: '20px'}}>
                                <div className={styles.product_image_container}>
                                    <img 
                                        src={appointment.masters.photo} 
                                        alt={`${appointment.masters.lname} ${appointment.masters.fname}`}
                                        className={styles.product_image}
                                    />
                                </div>
                                <div className={styles.product_details}>
                                    <div className={styles.product_name}>
                                        {appointment.masters.lname} {appointment.masters.fname} {appointment.masters.patronymic}
                                    </div>
                                    <div className={styles.product_category}>
                                        {appointment.masters.mastersSkills.name}, {appointment.masters.mastersQualifications.typeServices.name}
                                    </div>
                                </div>
                            </div>

                            <Divider orientation="left">Услуги</Divider>

                            <div className={styles.products_list}>
                                {appointmentServices.map((service) => (
                                    <div className={styles.product_item} key={service.id}>
                                        <div className={styles.product_details}>
                                            <div className={styles.product_name}>
                                                {service.services.serviceName}
                                            </div>
                                            <div className={styles.product_category}>
                                                {service.services.typeServices.name}
                                            </div>
                                            <div className={styles.product_price_info}>
                                                <span className={styles.product_price}>
                                                    {(() => {
                                                        switch (appointment.masters.skillId) {
                                                            case 1: return service.services.juniorPrice;
                                                            case 2: return service.services.middlePrice;
                                                            case 3: return service.services.seniorPrice;
                                                            default: return service.services.juniorPrice;
                                                        }
                                                    })()} ₽
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.order_footer}>
                                <div className={styles.total_sum}>
                                    Итого: <span>{appointment.totalSum} ₽</span>
                                </div>
                                {appointment.statusId === 2 && (
                                    <button 
                                        className={styles.cancel_button}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancel(appointment.id);
                                        }}
                                    >
                                        Отменить запись
                                    </button>
                                )}
                            </div>
                        </div>
                    </Panel>
                ))}
            </Collapse>
        </div>
    );
} 