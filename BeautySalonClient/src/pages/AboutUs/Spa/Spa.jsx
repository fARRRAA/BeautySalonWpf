import s from './Spa.module.css'
import { Title } from '/src/components/UI/Text/Title/Title'
import { SubTitle } from '/src/components/UI/Text/Subtitle/Subtitle'

export function Spa() {
    return (
        <>
            <section className={s.testimonials}>
                <div className="container">
                    <div className={s.testimonials_inner}>
                        <Title title="Наши СПА Процедуры" />
                        <p className={s.subtitle}>Погрузитесь в мир релакса и абсолютного комфорта с нашими уникальными спа-процедурами.</p>
                        <div className={s.testimonials_content}>
                            <img src="/src/assets/imgs/spa.png" alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}