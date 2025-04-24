import s from './Login.module.css'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { AuthApiService } from '../../api/AuthApiService';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { Navigate, useNavigate,Link } from 'react-router-dom';

export function Login() {

    let api = new AuthApiService();
    const [isConfirmStep, setIsConfirmStep] = useState(false);
    const [emailInput, setEmail] = useState('');
    const [codeInput, setCode] = useState('');
    const navigate = useNavigate();

    const currentUser = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser.isAuth) {
            navigate("/");
        }
    }, [])

    const showToastMessageError = (error) => {
        toast.error(error, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            // pauseOnHover: true,
            draggable: true
        });
    };
    const showToastMessageWarning = (error) => {
        toast.warning(error, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            // pauseOnHover: true,
            draggable: true
        });
    };
    const showToastMessageSuccess = (error) => {
        toast.success(error, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            // pauseOnHover: true,
            draggable: true
        });
    };

    async function checkForm() {
        if (!isConfirmStep) {
            if (emailInput.length == 0) {
                showToastMessageError('Введите почту');
                return;
            }
            var res = await api.checkUser(emailInput);
            if(!res){
                showToastMessageError('Пользователя с такой почтой не существует');
                return;
            }
            let login = await api.login(emailInput);
            showToastMessageSuccess(login);
            setIsConfirmStep(true);
        } else {
            if (codeInput.length == 0) {
                showToastMessageError('Введите код подтверждения');
                return;
            }
            let confirm = await api.confirmCode({ email: emailInput, code: codeInput });
            if (!confirm) {
                showToastMessageError("Неверный код или он истек.");
                return;
            }
            showToastMessageSuccess("Email успешно подтвержден.");
            var user = await api.getUserByEmail(emailInput);
            dispatch(setUser({
                id: user.userID,
                email: user.email,
                phone: user.phone,
                role: user.roleId,
                isEmailConfirmed: user.isEmailConfirmed
            }));
            // showToastMessageSuccess(currentUser.id);
            setTimeout(() => navigate("/user/profile"), 1500);
            // console.log(currentUser)
        }
    }

    return (
        <>
            <div className={s.login}>
                <div className="container">
                    <div className={s.login_inner}>
                        <div className={s.login_form}>
                            <p className={s.login_title}>
                                {!isConfirmStep ? 'Вход в аккаунт' : 'Подтвердите вход'}
                            </p>
                            <form action="" method='post' className={s.login_form} onSubmit={(e) => { e.preventDefault() }}>
                                <div className={`${s.form_item} ${isConfirmStep ? s.hidden : ''}`}>
                                    <input
                                        type="mail"
                                        id="user"
                                        name="user"
                                        placeholder=" "
                                        value={emailInput}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                    <label htmlFor="user">Введите почту</label>
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
                                        {!isConfirmStep ? 'Войти в аккаунт' : 'Подтвердить код'}
                                    </p>
                                </button>
                            </form>
                            <Link to="/register" className={s.register}>Нет аккаунта? <span>Зарегистрируйтесь</span></Link>
                        </div>
                    </div>

                </div>
            </div>
            <ToastContainer />

        </>
    )
}