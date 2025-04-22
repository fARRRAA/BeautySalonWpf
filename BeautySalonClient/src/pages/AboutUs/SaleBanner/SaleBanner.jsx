import { Link } from 'react-router-dom'
import s from './SaleBanner.module.css'

export function SaleBanner() {
    return (
        <>
            <div className={s.banner}>
                <div className="container">
                    <div className={s.banner_inner}>
                        <div className={s.banner_content}>
                            <p className={s.sale_text}>-25% Скидка</p>
                            <p className={s.sale_title}>Макияж & Маникюр</p>
                            <button className={s.btn}>
                                <Link to="/book">Записаться</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}