import React, { useState, useEffect } from 'react';
import styles from './Appointment.module.css';

const ServiceSelection = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
    
    const handleSkillLevelChange = (event) => {
        setSelectedSkillLevel(event.target.value);
    };

    return (
        <>
            {selectedCategory && (
                <div className={styles.skill_level_selector}>
                    <select 
                        value={selectedSkillLevel}
                        onChange={handleSkillLevelChange}
                        className={styles.skill_level_select}
                    >
                        <option value="">Выберите уровень мастера</option>
                        <option value="junior">Младший мастер</option>
                        <option value="middle">Мастер</option>
                        <option value="senior">Старший мастер</option>
                    </select>
                </div>
            )}
        </>
    );
}

export default ServiceSelection; 