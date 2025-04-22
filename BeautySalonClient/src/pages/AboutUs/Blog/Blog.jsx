import s from './Blog.module.css'
import { Title } from '/src/components/UI/Text/Title/Title'

const blogPosts = [
    {
        id: 1,
        image: "/src/assets/imgs/blog/blog1.png",
        date: {
            day: "18",
            month: "Фев"
        },
        category: "Спа / Уход",
        title: "Новая процедура для глубокого очищения кожи лица",
        link: "#"
    },
    {
        id: 2,
        image: "/src/assets/imgs/blog/blog2.png",
        date: {
            day: "31",
            month: "Дек"
        },
        category: "Маникюр / Уход",
        title: "Трендовые дизайны маникюра этой зимы",
        link: "#"
    },
    {
        id: 3,
        image: "/src/assets/imgs/blog/blog3.png",
        date: {
            day: "15",
            month: "Янв"
        },
        category: "Макияж / Новости",
        title: "Новая коллекция профессиональной косметики",
        link: "#"
    },
    {
        id: 4,
        image: "/src/assets/imgs/blog/blog4.png",
        date: {
            day: "21",
            month: "Фев"
        },
        category: "Косметология / Уход",
        title: "Инновационные методы омоложения кожи",
        link: "#"
    }
];

export function Blog() {
    return (
        <div className={s.blog}>
            <div className="container">
                <div className={s.blog_inner}>
                    <Title title="Наш Блог" />
                    <p className={s.subtitle}>
                        Последние новости нашего салона
                    </p>
                    <div className={s.wrapper}>
                        {blogPosts.map(post => (
                            <div key={post.id} className={s.blog_card}>
                                <div className={s.blog_img}>
                                    <img src={post.image} alt={post.title} />
                                    <div className={s.date}>
                                        <span className={s.day}>{post.date.day}</span>
                                        <span className={s.month}>{post.date.month}</span>
                                    </div>
                                </div>
                                <div className={s.blog_info}>
                                    <p className={s.category}>{post.category}</p>
                                    <h3 className={s.post_title}>{post.title}</h3>
                                    <a href={post.link} className={s.read_more}>
                                        Читать далее →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}