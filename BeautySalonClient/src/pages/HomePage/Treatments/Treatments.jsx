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
                                    <span>Nail care</span>
                                    <span class="price">from $25</span>
                                </li>
                                <li>
                                    <span>Hair Styling</span>
                                    <span class="price">from $30</span>
                                </li>
                                <li>
                                    <span>Make up</span>
                                    <span class="price">from $50</span>
                                </li>
                                <li>
                                    <span>Cosmetology</span>
                                    <span class="price">from $30</span>
                                </li>
                                <li>
                                    <span>SPA procedures</span>
                                    <span class="price">from $40</span>
                                </li>
                            </ul>
                            <Link to="/services" class="view-all">View all</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
