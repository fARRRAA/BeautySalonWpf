import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '/src/assets/imgs/default-avatar.png'
import { removeUser } from '../../store/slices/userSlice';
import styles from './Profile.module.css';
import { AuthApiService } from '../../api/AuthApiService';
import { useAuth } from '../../hooks/useAuth';
export const PersonalInfo = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userApi = new AuthApiService();
    const [userData, setUserData] = useState(null);
    const currentUser = useAuth();
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };
    useEffect(() => {
        const getUser = async () => {
            var user = await userApi.getUserByEmail(currentUser.email);
            setUserData(user);
        };
        getUser();
    }, [])

    const exit = () => {
        dispatch(removeUser());
        navigate('/');
    };

    return (
        <div className={styles.profile_content}>
            <div className={styles.profile_wrapper}>
                <div className={styles.profile_photo}>
                    <img
                        src={user.photo || defaultAvatar}
                        alt="Фото профиля"
                        className={styles.photo}
                    />
                    <button className={styles.change_photo_btn} onClick={exit}>
                        Выйти
                    </button>
                </div>

                {
                    userData ?
                        <div className={styles.profile_info}>
                            <div className={styles.info_group}>
                                <h2 className={styles.group_title}>Основная информация</h2>
                                <div className={styles.info_item}>
                                    <span className={styles.label}>Фамилия:</span>
                                    <span className={styles.value}>{userData.lname}</span>
                                </div>
                                <div className={styles.info_item}>
                                    <span className={styles.label}>Имя:</span>
                                    <span className={styles.value}>{userData.fName}</span>
                                </div>
                                <div className={styles.info_item}>
                                    <span className={styles.label}>Дата рождения:</span>
                                    <span className={styles.value}>{formatDate(userData.dateBirth)}</span>
                                </div>
                            </div>

                            <div className={styles.info_group}>
                                <h2 className={styles.group_title}>Контактная информация</h2>
                                <div className={styles.info_item}>
                                    <span className={styles.label}>Email:</span>
                                    <span className={styles.value}>{userData.email}</span>
                                    {!user.isEmailConfirmed && (
                                        <span className={styles.not_confirmed}>Не подтвержден</span>
                                    )}
                                </div>
                                <div className={styles.info_item}>
                                    <span className={styles.label}>Телефон:</span>
                                    <span className={styles.value}>{userData.phone}</span>
                                </div>
                            </div>

                            <div className={styles.info_group}>
                                <h2 className={styles.group_title}>Предпочтения</h2>
                                <div className={styles.preferences}>
                                    <p>{userData.preferences || 'Предпочтения не указаны'}</p>
                                </div>
                            </div>

                        </div>
                        : <p>загрузка данных...</p>
                }
            </div>
        </div>
    );
};

