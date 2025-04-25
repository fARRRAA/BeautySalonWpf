import React, { useState, useEffect } from 'react';
import { errorMsg, warningMsg } from '../../../messages/mesages';
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
    const [mastersTimeSlots, setMastersTimeSlots] = useState({});
    const [loading, setLoading] = useState(false);

    // Вычисляем общую длительность выбранных услуг
    const calculateTotalDuration = () => {
        return appointmentData.services.reduce((total, service) => {
            return total + service.skillLevel.duration;
        }, 0);
    };

    // Получаем serviceId из первой услуги
    const getServiceId = () => {
        return appointmentData.services[0].serviceId;
    };

    // Получаем skillId из первой услуги
    const getSkillId = () => {
        return appointmentData.services[0].skillLevel.name;
    };

    useEffect(() => {
        const fetchMasters = async () => {
            if (!selectedDate) return;
            try {
                setLoading(true);
                // Создаем новую дату с учетом часового пояса
                const localDate = new Date(selectedDate);
                localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
                const formattedDate = localDate.toISOString().split('T')[0];

                const response = await appointmentApi.getMasters({
                    date: formattedDate,
                    typeId: getServiceId(),
                    skillId: getSkillId()
                });
                if (response && response.length > 0) {
                    setAvailableMasters(response);

                    // Получаем временные слоты для каждого мастера
                    const timeSlotsMap = {};
                    for (const master of response) {
                        const timeSlots = await appointmentApi.getTimeSlots({
                            serviceId: getServiceId(),
                            skillId: getSkillId(),
                            date: formattedDate,
                            duration: calculateTotalDuration()
                        });

                        if (timeSlots && timeSlots.length > 0) {
                            timeSlotsMap[master.id] = timeSlots;
                        }
                    }
                    setMastersTimeSlots(timeSlotsMap);
                } else {
                    setAvailableMasters([]);
                    setMastersTimeSlots({});
                }
            } catch (error) {
                errorMsg('Ошибка при загрузке мастеров', 2000);
                console.error('Error fetching masters:', error);
                setAvailableMasters([]);
                setMastersTimeSlots({});
            } finally {
                setLoading(false);
            }
        };

        fetchMasters();
    }, [selectedDate]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedMaster(null);
        setSelectedTime(null);
    };

    const handleMasterSelect = (master) => {
        setSelectedMaster(master);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleNext = () => {
        if (!selectedDate || !selectedTime || !selectedMaster) {
            warningMsg('Пожалуйста, выберите дату, мастера и время', 2000);
            return;
        }

        onNext({
            masterId: selectedMaster.masterId,
            date: selectedDate,
            timeStart: `${selectedTime}:00`,
        });
    };

    const tileDisabled = ({ date }) => {
        return date < new Date() || date.getDay() === 0;
    };

    const formatTime = (timeString) => {
        return timeString.slice(0, 5);
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
                        <h3 className={styles.info_title}>
                            {loading ? 'Загрузка...' : 'Выберите мастера и время'}
                        </h3>
                        <div className={styles.masters_list}>
                            {loading ? (
                                <div className={styles.loading}>Загрузка мастеров...</div>
                            ) : availableMasters.length > 0 ? (
                                availableMasters.map(master => (
                                    <div key={master.id} className={styles.master_block}>
                                        <div
                                            className={`${styles.master_item} ${selectedMaster?.id === master.id ? styles.selected : ''}`}
                                            onClick={() => handleMasterSelect(master)}
                                        >
                                            <div className={styles.master_name}>
                                                {master.lname + " " + master.fname + " " + master.patronymic}
                                            </div>
                                            <div className={styles.master_info}>
                                            <p className={styles.master_subinfo}>{master.mastersQualifications.typeServices.name},</p>
                                            <p className={styles.master_subinfo}> {master.mastersSkills.name}</p>

                                            </div>
                                        </div>

                                        {selectedMaster?.id === master.id && (
                                            <div className={styles.time_slots_container}>
                                                <h4 className={styles.time_slots_title}>Доступное время:</h4>
                                                <div className={styles.time_slots}>
                                                    {mastersTimeSlots[master.id]?.length > 0 ? (
                                                        mastersTimeSlots[master.id].map(time => (
                                                            <div
                                                                key={time}
                                                                className={`${styles.time_slot} ${selectedTime === time ? styles.selected : ''}`}
                                                                onClick={() => handleTimeSelect(time)}
                                                            >
                                                                {formatTime(time)}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className={styles.no_time_slots}>
                                                            Нет свободного времени
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.no_masters}>
                                    На выбранную дату нет свободных мастеров
                                </div>
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