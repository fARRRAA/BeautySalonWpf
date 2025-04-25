import React from 'react';
import styles from './Appointment.module.css';
import { Button } from '../../components/Button/Button';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatters';
import { AppointmentData } from '../../types/appointment';

interface ConfirmStepProps {
    appointmentData: AppointmentData;
    onConfirm: () => void;
    onBack: () => void;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({
    appointmentData,
    onConfirm,
    onBack
}) => {
    const { selectedDate, selectedTime, selectedMaster, selectedServices } = appointmentData;
    
    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

    return (
        <div className={styles.confirm_section}>
            <div className={styles.confirm_info}>
                <h3 className={styles.info_title}>Информация о записи</h3>
                <div className={styles.info_block}>
                    <div className={styles.info_row}>
                        <span className={styles.info_label}>Дата</span>
                        <span className={styles.info_value}>{formatDate(selectedDate)}</span>
                    </div>
                    <div className={styles.info_row}>
                        <span className={styles.info_label}>Время</span>
                        <span className={styles.info_value}>{formatTime(selectedTime)}</span>
                    </div>
                    <div className={styles.info_row}>
                        <span className={styles.info_label}>Мастер</span>
                        <span className={styles.info_value}>{selectedMaster.name}</span>
                    </div>
                </div>

                <h3 className={styles.info_title}>Выбранные услуги</h3>
                <div className={styles.info_block}>
                    {selectedServices.map((service) => (
                        <div key={service.id} className={styles.info_row}>
                            <span className={styles.info_label}>{service.name}</span>
                            <span className={styles.info_value}>{formatPrice(service.price)}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.confirm_summary}>
                    <h3 className={styles.info_title}>Итого</h3>
                    <div className={styles.summary_block}>
                        <div className={styles.total_row}>
                            <span className={styles.total_label}>К оплате</span>
                            <span className={styles.total_value}>{formatPrice(totalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.buttons_group}>
                <Button variant="outlined" onClick={onBack}>
                    Назад
                </Button>
                <Button onClick={onConfirm}>
                    Подтвердить запись
                </Button>
            </div>
        </div>
    );
}; 