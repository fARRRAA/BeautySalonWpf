import s from './SubTitle.module.css'

export function SubTitle({ title }) {
    return (
        <>
            <p className={s.subtitle}>{title}</p>
        </>
    )
}