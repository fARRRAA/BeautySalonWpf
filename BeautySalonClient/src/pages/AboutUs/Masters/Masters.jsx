import s from './Masters.module.css'
import { useEffect, useState } from 'react';
import { MastersApiService } from '../../../api/MastersApiService';
import { Title } from '/src/components/UI/Text/Title/Title'
import { SubTitle } from '/src/components/UI/Text/Subtitle/Subtitle'

export function Masters() {
    const [masters, setMasters] = useState([]);
    const [filteredMasters, setFilteredMasters] = useState([]);
    let api = new MastersApiService();

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const result = await api.getMasters();
                setMasters(result);
                const mastersMap = result.reduce((acc, master) => {
                    const typeId = master.typeServices.id;
                    if (!acc.has(typeId)) {
                        acc.set(typeId, master);
                    }
                    return acc;
                }, new Map());

                // Преобразуем Map в массив
                const uniqueMasters = Array.from(mastersMap.values());
                setFilteredMasters(uniqueMasters);
            } catch (error) {
                console.error('Ошибка при загрузке мастеров:', error);
            }
        };
        fetchMasters();
    }, []);
    console.log(filteredMasters)
    return (
        <div className={s.masters}>
            <div className="container">
                <div className={s.masters_inner}>
                    <Title title="Наши Специалисты" />
                    <p className={s.subtitle}>
                        Каждый мастер - профессионал со стажем работы более 5 лет в индустрии красоты
                    </p>
                    <div className={s.wrapper}>
                        {filteredMasters.map(master => (
                            <div key={master.masterId} className={s.master_card}>
                                <div className={s.master_img}>
                                    <img src={master.master.photo} alt="" className={s.master_photo} />

                                </div>
                                <div className={s.masters_fullname}>
                                    <p className={s.masters_fname}>{master.master.fname}</p>
                                    <p className={s.masters_lname}>{master.master.lname}</p>
                                </div>
                                <p className={s.service_type}>{master.master.mastersQualifications.typeServices.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
