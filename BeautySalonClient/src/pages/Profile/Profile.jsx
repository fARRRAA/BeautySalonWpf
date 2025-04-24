import s from './Profile.module.css'
import { useEffect, useState } from 'react'
import { AuthApiService } from '../../api/AuthApiService'
import { useAuth } from '../../hooks/useAuth'
import defaultAvatar from '/src/assets/imgs/default-avatar.png'
import { useDispatch } from 'react-redux'
import { removeUser } from '../../store/slices/userSlice'
import { useNavigate } from 'react-router-dom'
export function Profile() {
    const [user, setUser] = useState(null)
    const currentUser = useAuth()
    const api = new AuthApiService()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if(!currentUser.isAuth){
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

    if (!user) return <div className={s.loading}>Загрузка...</div>

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU')
    }

    function exit() {
        dispatch(removeUser());
        navigate("/");
    }

    return (
        <div className={s.profile}>
            <div className="container">
                <div className={s.profile_inner}>
                    <h1 className={s.profile_title}>Личный кабинет</h1>

                    <div className={s.profile_content}>
                        <div className={s.profile_photo}>
                            <img
                                src={user.photo || defaultAvatar}
                                alt="Фото профиля"
                                className={s.photo}
                            />
                            {/* <button className={s.change_photo_btn}>
                                Изменить фото
                            </button> */}
                            <button className={s.change_photo_btn} onClick={exit}>
                                Выйти
                            </button>
                        </div>

                        <div className={s.profile_info}>
                            <div className={s.info_group}>
                                <h2 className={s.group_title}>Основная информация</h2>
                                <div className={s.info_item}>
                                    <span className={s.label}>Фамилия:</span>
                                    <span className={s.value}>{user.lname}</span>
                                </div>
                                <div className={s.info_item}>
                                    <span className={s.label}>Имя:</span>
                                    <span className={s.value}>{user.fName}</span>
                                </div>
                                <div className={s.info_item}>
                                    <span className={s.label}>Дата рождения:</span>
                                    <span className={s.value}>{formatDate(user.dateBirth)}</span>
                                </div>
                            </div>

                            <div className={s.info_group}>
                                <h2 className={s.group_title}>Контактная информация</h2>
                                <div className={s.info_item}>
                                    <span className={s.label}>Email:</span>
                                    <span className={s.value}>{user.email}</span>
                                    {!user.isEmailConfirmed &&
                                        <span className={s.not_confirmed}>Не подтвержден</span>
                                    }
                                </div>
                                <div className={s.info_item}>
                                    <span className={s.label}>Телефон:</span>
                                    <span className={s.value}>{user.phone}</span>
                                </div>
                            </div>

                            <div className={s.info_group}>
                                <h2 className={s.group_title}>Предпочтения</h2>
                                <div className={s.preferences}>
                                    <p>{user.preferences || 'Предпочтения не указаны'}</p>
                                </div>
                            </div>

                            <div className={s.profile_stats}>
                                <div className={s.stats_item}>
                                    <span className={s.stats_value}>{user.visitsCount}</span>
                                    <span className={s.stats_label}>посещений</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}