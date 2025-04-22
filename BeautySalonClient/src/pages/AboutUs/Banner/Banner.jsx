import { Link } from "react-router-dom"
import s from "./Banner.module.css"
import { Title } from '/src/components/UI/Text/Title/Title'

export function Banner(){

    return (
        <>
        <div className={s.banner}>
            <div className="container">
                <div className={s.banner_inner}>
                    <div className={s.banner_image}>
                        <img src="/src/assets/imgs/aboutusbanner.png" alt="" />
                    </div>
                    <div className={s.banner_content}>
                    <Title  title="Модные стили из города, обслуживание на высшем уровне"/>
                    <p className={s.banner_subtitle}>В нашем салоне красоты мы объединяем современные тенденции моды с профессиональным подходом к каждому клиенту. Наша команда опытных мастеров постоянно совершенствует свои навыки, чтобы предлагать вам только лучшие услуги по уходу за собой.</p>
                    <button className={s.banner_btn}>
                        <Link to="/services">
                        Подробнее
                        </Link>

                    </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}