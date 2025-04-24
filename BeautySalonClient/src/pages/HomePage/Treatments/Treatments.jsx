import { Link } from 'react-router-dom'
import  './Treatments.css'

export function Treatments() {
    return (
        <>
            <div className="treatments">
                <div className="container">
                    <div className="treatments_inner">
                        <img className="treatments_img" src="/src/assets/imgs/treatmentsImg.png"></img>
                        <div className="treatments_list">
                            <p className="treatments_title">Услуги и цены</p>
                            <p  className="treatments_subtitle">Мы предлагаем широкий спектр услуг для красоты и ухода за собой

</p>
                            <ul class="services_wrapper">
                                <li>
                                    <span>Маникюр</span>
                                    <span class="price">от 800 ₽</span>
                                </li>
                                <li>
                                    <span>Прическа</span>
                                    <span class="price">от 1000 ₽</span>
                                </li>
                                <li>
                                    <span>Макияж</span>
                                    <span class="price">от 1500 ₽</span>
                                </li>
                                <li>
                                    <span>Косметология</span>
                                    <span class="price">от 1200 ₽</span>
                                </li>
                                <li>
                                    <span>СПА процедуры</span>
                                    <span class="price">от 2000 ₽</span>
                                </li>
                            </ul>
                            <Link to="/services#services" class="view-all">Посмотреть все</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
