import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { PersonalInfo } from './PersonalInfo';
import { AppointmentsList } from './AppointmentsList';
import styles from './Profile.module.css';
import { AuthApiService } from '../../api/AuthApiService'
import { useAuth } from '../../hooks/useAuth'
import defaultAvatar from '/src/assets/imgs/default-avatar.png'
import { useDispatch } from 'react-redux'
import { removeUser } from '../../store/slices/userSlice'
import { useNavigate } from 'react-router-dom'

const { TabPane } = Tabs;

export const Profile = () => {
    const user = useAuth();
    const currentUser = useAuth()
    const api = new AuthApiService()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser.isAuth) {
            navigate("/login");
        }
        const fetchUser = async () => {
            if (currentUser.id) {
                const userData = await api.getUserById(currentUser.id)
                setUser(userData)
            }
        }
        fetchUser()
    }, [currentUser.id])

    if (!user) {
        return <div>Пожалуйста, войдите в систему</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU')
    }

    function exit() {
        dispatch(removeUser());
        navigate("/");
    }

    return (
        <div className="container">
            <div className={styles.profile_container}>
                <h1 className={styles.profile_title}>Личный кабинет</h1>
                <Tabs defaultActiveKey="1" className={styles.profile_tabs}>
                    <TabPane tab="Личная информация" key="1" style={{background:'#fff'}}>
                        <PersonalInfo user={user} />
                    </TabPane>
                    <TabPane tab="Мои записи" key="2" style={{background:'#fff'}}>
                        <AppointmentsList userId={user.id} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;