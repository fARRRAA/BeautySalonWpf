import s from './Instagram.module.css'
import { instStore } from '../../../imgStore'
export function Instagram() {
    return (
        <>
            <div className={s.instagram}>
                <p className={s.title}>Следите за нашим инстаграмом</p>
                <p className={s.subtitle}> Присоединяйтесь к нам, чтобы быть в курсе всего самого интересного! В нашем Инстаграме мы делимся последними новостями салона.
                </p>
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