import s from './Title.module.css'

export function Title({ title }) {
    return (
        <>
            <p className={s.title}>{title}</p>
        </>
    )
}