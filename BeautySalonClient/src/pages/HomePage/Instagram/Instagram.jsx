import s from './Instagram.module.css'
import { instStore } from '../../../imgStore'
export function Instagram() {
    return (
        <>
            <div className={s.instagram}>
                <p className={s.title}>Follow our Instagram</p>
                <p className={s.subtitle}>Viverra nulla amet a ultrices massa dui. Tortor est purus morbi vitae arcu suspendisse amet.</p>
                <div className={s.wrapper}>
                    <img src="/src/assets/imgs/inst/inst1.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst2.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst3.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst4.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst5.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst6.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst7.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst8.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst9.png" className={s.img}></img>
                    <img src="/src/assets/imgs/inst/inst10.png" className={s.img}></img>
                </div>
            </div>
        </>
    )
}