import { Link } from 'react-router-dom'
import s from './NotFound.module.css'

export function NotFound() {
    return (
        <div className={s.not_found}>
            <div className="container">
                <div className={s.notfound_inner}>
                    <p className={s.notfound_number}>
                        404
                    </p>
                    <p className={s.notfound_title}>
                        Страница не найдена
                    </p>
                    <p className={s.notfound_description}>
                        Страница, которую вы ищете, не существует.
                    </p>
                    <Link to="/">
                        <button className={s.notfound_button}>
                            Вернуться на главную
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    )
}
