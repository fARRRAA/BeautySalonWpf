import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { PersonalInfo } from './PersonalInfo';
import { AppointmentsList } from './AppointmentsList';
import { OrdersList } from './OrdersList';
import styles from './Profile.module.css';
import { AuthApiService } from '../../api/AuthApiService'
import { useAuth } from '../../hooks/useAuth'
import defaultAvatar from '/src/assets/imgs/default-avatar.png'
import { useDispatch } from 'react-redux'
import { removeUser } from '../../store/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const { TabPane } = Tabs;

export const Profile = () => {
    const currentUser = useAuth();
    const api = new AuthApiService()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser.isAuth) {
            navigate("/login");
        }
    }, [currentUser.id])

    if (!currentUser) {
        return <div>Пожалуйста, войдите в систему</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU')
    }

    function exit() {
        dispatch(removeUser());
        Cookies.remove('user');
        navigate("/");
    }

    return (
        <div className="container">
            <div className={styles.profile_container}>
                <h1 className={styles.profile_title}>Личный кабинет</h1>
                <Tabs defaultActiveKey="1" className={styles.profile_tabs} style={{background:'#fff'}}>
                    <TabPane tab="Личная информация" key="1" style={{background:'#fff'}}>
                        <PersonalInfo user={currentUser} />
                    </TabPane>
                    <TabPane tab="Мои записи" key="2" style={{background:'#fff'}}>
                        <AppointmentsList userId={currentUser.id} />
                    </TabPane>
                    <TabPane tab="Мои заказы" key="3" style={{background:'#fff'}}>
                        <OrdersList userId={currentUser.id} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;