import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from '../Appointment.module.css';
import { AppointmentApiService } from '../../../api/AppointmentApiservice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const appointmentApi = new AppointmentApiService();

const DateMasterSelection = ({ onNext, onPrev, appointmentData }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [availableMasters, setAvailableMasters] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDate && selectedMaster) {
            fetchAvailableTimeSlots();
        }
    }, [selectedDate, selectedMaster]);

    const fetchAvailableTimeSlots = async () => {
        try {
            setLoading(true);
            const response = await appointmentApi.getTimeSlots({
                date: selectedDate.toISOString().split('T')[0],
                masterId: selectedMaster.id,
                serviceId: appointmentData.services[0].serviceId
            });
            setAvailableTimeSlots(response);
        } catch (error) {
            toast.error('Ошибка при загрузке доступного времени');
            console.error('Error fetching time slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleMasterSelect = (master) => {
        setSelectedMaster(master);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const calculateEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = appointmentData.services[0].skillLevels[0].duration;
        
        const endMinutes = hours * 60 + minutes + totalMinutes;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        
        return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}:00`;
    };

    const handleNext = () => {
        if (!selectedDate || !selectedTime || !selectedMaster) {
            toast.warning('Пожалуйста, выберите дату, мастера и время');
            return;
        }

        const service = appointmentData.services[0];
        const skillLevel = service.skillLevels[0];

        onNext({
            masterId: selectedMaster.id,
            date: selectedDate,
            timeStart: selectedTime,
            timeEnd: calculateEndTime(selectedTime),
            totalSum: skillLevel.price,
            totalDuration: skillLevel.duration
        });
    };

    const tileDisabled = ({ date }) => {
        return date < new Date() || date.getDay() === 0; // Запрещаем выбор прошедших дат и воскресений
    };

    return (
        <div className={styles.step_container}>
            <div className={styles.date_master_container}>
                <div className={styles.calendar_section}>
                    <h3 className={styles.info_title}>Выберите дату</h3>
                    <Calendar
                        onChange={handleDateSelect}
                        value={selectedDate}
                        tileDisabled={tileDisabled}
                        minDate={new Date()}
                        className={styles.calendar}
                    />
                </div>

                {selectedDate && (
                    <div className={styles.masters_section}>
                        <h3 className={styles.info_title}>Выберите мастера</h3>
                        <div className={styles.masters_list}>
                            {loading ? (
                                <div>Загрузка мастеров...</div>
                            ) : availableMasters.length > 0 ? (
                                availableMasters.map(master => (
                                    <div
                                        key={master.id}
                                        className={`${styles.master_item} ${selectedMaster?.id === master.id ? styles.selected : ''}`}
                                        onClick={() => handleMasterSelect(master)}
                                    >
                                        <div className={styles.master_name}>{master.name}</div>
                                        <div className={styles.master_info}>
                                            <span>Рейтинг: {master.rating}</span>
                                            <span>Стаж: {master.experience} лет</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>Нет доступных мастеров на выбранную дату</div>
                            )}
                        </div>
                    </div>
                )}

                {selectedMaster && (
                    <div className={styles.time_section}>
                        <h3 className={styles.info_title}>Выберите время</h3>
                        <div className={styles.time_slots}>
                            {loading ? (
                                <div>Загрузка времени...</div>
                            ) : availableTimeSlots.length > 0 ? (
                                availableTimeSlots.map(time => (
                                    <div
                                        key={time}
                                        className={`${styles.time_slot} ${selectedTime === time ? styles.selected : ''}`}
                                        onClick={() => handleTimeSelect(time)}
                                    >
                                        {time.slice(0, 5)}
                                    </div>
                                ))
                            ) : (
                                <div>Нет доступного времени</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.button_group}>
                <button
                    className={`${styles.button} ${styles.button_secondary}`}
                    onClick={onPrev}
                >
                    Назад
                </button>
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

export default DateMasterSelection; 