import React, { useState, useEffect } from 'react';
import { errorMsg, warningMsg } from '../../../messages/mesages';
import styles from '../Appointment.module.css';
import { AppointmentApiService } from '../../../api/AppointmentApiservice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast, ToastContainer } from 'react-toastify';

const appointmentApi = new AppointmentApiService();

const DateMasterSelection = ({ onNext, onPrev, appointmentData }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimes, setSelectedTimes] = useState({});
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [availableMasters, setAvailableMasters] = useState([]);
    const [mastersTimeSlots, setMastersTimeSlots] = useState({});
    const [loading, setLoading] = useState(false);

    const calculateTotalDuration = () => {
        return appointmentData.services.reduce((total, service) => {
            return total + service.skillLevel.duration;
        }, 0);
    };

    const getServiceId = () => {
        return appointmentData.services[0].serviceId;
    };

    const getSkillId = () => {
        return appointmentData.services[0].skillLevel.name;
    };

    useEffect(() => {
        const fetchMasters = async () => {
            if (!selectedDate) return;
            try {
                setLoading(true);
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

                    const timeSlotsMap = {};
                    for (const master of response) {
                        const timeSlots = await appointmentApi.getTimeSlots({
                            serviceId: getServiceId(),
                            skillId: getSkillId(),
                            date: formattedDate,
                            duration: calculateTotalDuration()
                        });

                        if (timeSlots && timeSlots.length > 0) {
                            timeSlotsMap[master.masterId] = timeSlots;
                        }
                    }
                    setMastersTimeSlots(timeSlotsMap);
                } else {
                    setAvailableMasters([]);
                    setMastersTimeSlots({});
                }
            } catch (error) {
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
        setSelectedTimes({});
    };

    const handleMasterSelect = (master) => {
        setSelectedMaster(master);
    };

    const handleTimeSelect = (masterId, time) => {
        if(!selectedMaster || selectedMaster.masterId !== masterId){
            warningMsg('Пожалуйста, выберите мастера',2000);
            return;
        }
        setSelectedTimes(prev => ({ ...prev, [masterId]: time }));
    };

    const handleNext = () => {
        if (!selectedDate || !selectedMaster || !selectedTimes[selectedMaster.masterId]) {
            warningMsg('Пожалуйста, выберите дату, мастера и время',2000);
            return;
        }

        onNext({
            masterId: selectedMaster.masterId,
            date: selectedDate,
            timeStart: `${selectedTimes[selectedMaster.masterId]}:00`,
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
                                    <div key={master.masterId} className={styles.master_block}>
                                        <div
                                            className={`${styles.master_item} ${selectedMaster?.masterId === master.masterId ? styles.selected : ''}`}
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

                                        {selectedMaster?.masterId === master.masterId && (
                                            <div className={styles.time_slots_container}>
                                                <h4 className={styles.time_slots_title}>Доступное время:</h4>
                                                <div className={styles.time_slots}>
                                                    {mastersTimeSlots[master.masterId]?.length > 0 ? (
                                                        mastersTimeSlots[master.masterId].map(time => (
                                                            <div
                                                                key={time}
                                                                className={`${styles.time_slot} ${selectedTimes[master.masterId] === time ? styles.selected : ''}`}
                                                                onClick={() => handleTimeSelect(master.masterId, time)}
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
            <ToastContainer />

        </div>
    );
};

export default DateMasterSelection; 