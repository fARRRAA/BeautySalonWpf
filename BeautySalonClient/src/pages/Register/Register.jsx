import s from './Register.module.css'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { AuthApiService } from '../../api/AuthApiService';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
export function Register() {
    let api = new AuthApiService();
    const [isConfirmStep, setIsConfirmStep] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [codeInput, setCode] = useState('');
    const navigate = useNavigate();
    const currentUser = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const user = JSON.parse(userCookie);
            dispatch(setUser({
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isEmailConfirmed: user.isEmailConfirmed
            }));
            navigate("/");

        }
    }, [])

    const showToastMessageError = (error) => {
        toast.error(error, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true
        });
    };

    const showToastMessageSuccess = (message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function checkForm() {
        if (!isConfirmStep) {
            if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
                showToastMessageError('Заполните все поля');
                return;
            }

            if (!formData.phone.match(/^\+7\d{10}$/)) {
                showToastMessageError('Неверный формат телефона. Используйте формат +79991234567');
                return;
            }
            var res = await api.checkUser(formData.email);
            if (res) {
                showToastMessageError('Пользователь с такой почтой существует');
                return;
            }
            try {
                let registerResult = await api.register({
                    email: formData.email,
                    fName: formData.firstName,
                    lname: formData.lastName,
                    phone: formData.phone
                });

                showToastMessageSuccess("Код подтверждения отправлен на почту");
                setIsConfirmStep(true);
            } catch (error) {
                showToastMessageError(error.message || "Ошибка при регистрации");
            }
        } else {
            if (codeInput.length == 0) {
                showToastMessageError('Введите код подтверждения');
                return;
            }

            let confirm = await api.confirmCode({ email: formData.email, code: codeInput });
            if (!confirm) {
                showToastMessageError("Неверный код или он истек.");
                return;
            }
            showToastMessageSuccess("Email успешно подтвержден.");

            var user = await api.getUserByEmail(formData.email);
            dispatch(setUser({
                id: user.userID,
                email: user.email,
                phone: user.phone,
                role: user.roleId,
                isEmailConfirmed: user.isEmailConfirmed
            }));
            Cookies.set('user', JSON.stringify({
                id: user.userID,
                email: user.email,
                phone: user.phone,
                role: user.roleId,
                isEmailConfirmed: user.isEmailConfirmed
            }), { expires: 7 });
            setTimeout(() => navigate("/user/profile"), 1500);
        }
    }

    return (
        <>
            <div className={s.login}>
                <div className="container">
                    <div className={s.login_inner}>
                        <div className={s.login_form}>
                            <p className={s.login_title}>
                                {!isConfirmStep ? 'Регистрация' : 'Подтвердите почту'}
                            </p>
                            <form action="" method='post' className={s.login_form} onSubmit={(e) => { e.preventDefault() }}>
                                <div className={`${s.form_item} ${isConfirmStep ? s.hidden : ''}`}>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder=" "
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="lastName">Фамилия</label>
                                </div>

                                <div className={`${s.form_item} ${isConfirmStep ? s.hidden : ''}`}>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        placeholder=" "
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="firstName">Имя</label>
                                </div>

                                <div className={`${s.form_item} ${isConfirmStep ? s.hidden : ''}`}>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder=" "
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="phone">Телефон (+79)</label>
                                </div>

                                <div className={`${s.form_item} ${isConfirmStep ? s.hidden : ''}`}>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder=" "
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="email">Почта</label>
                                </div>

                                <div className={`${s.form_item} ${!isConfirmStep ? s.hidden : s.fade_in}`}>
                                    <input
                                        type="text"
                                        id="code"
                                        name="code"
                                        placeholder=" "
                                        value={codeInput}
                                        onChange={(e) => { setCode(e.target.value) }}
                                    />
                                    <label htmlFor="code">Введите код из письма</label>
                                </div>

                                <button type='submit' className={s.submit_btn} onClick={checkForm}>
                                    <p>
                                        {!isConfirmStep ? 'Зарегистрироваться' : 'Подтвердить код'}
                                    </p>
                                </button>
                            </form>
                            <Link to="/login" className={s.register}>Уже есть аккаунт? <span>Войдите</span></Link>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}