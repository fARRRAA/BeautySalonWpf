import s from './Testimonials.module.css'
import { useState } from 'react';

const testimonials = [
    {
        id: 1,
        name: "Анна Петрова",
        status: "Постоянный клиент",
        text: "Хочу выразить огромную благодарность мастеру маникюра Ольге! Каждый раз ухожу с безупречным маникюром, который держится больше двух недель. Атмосфера в салоне очень приятная, всегда чисто и уютно.",
        image: "/src/assets/imgs/test1.png"
    },
    {
        id: 2,
        name: "Жанна Маркова",
        status: "Заядлый посетитель",
        text: "За последние полгода побывала во многих салонах, но этот стал моим любимым. Особое спасибо парикмахеру Сергею за идеальную стрижку и окрашивание. Цены демократичные, а качество на высшем уровне!",
        image: "/src/assets/imgs/test2.png"
    },
    {
        id: 3,
        name: "Елена Сидорова",
        status: "Клиент",
        text: "Замечательный салон! Профессиональные мастера и отличный сервис. Всегда ухожу довольная результатом. Особенно нравится работа стилиста Анны, она настоящий профессионал своего дела. Буду рекомендовать всем подругам!",
        image: "/src/assets/imgs/test3.png"
    }
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(1);

    const handleImageClick = (index) => {
        setCurrentIndex(index);
    };

    const getDisplayOrder = () => {
        const prev = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
        const next = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
        return { prev, current: currentIndex, next };
    };

    const { prev, current, next } = getDisplayOrder();

    return (
        <section className={s.testimonials}>
            <div className="container">
                <div className={s.testimonials_inner}>
                    <h2 className={s.testimonials_title}>Отзывы</h2>
                    <p className={s.testimonials_subtitle}>
                        Реальные истории и впечатления от посещения салона.
                    </p>
                    <div className={s.testimonials_content}>
                        <div className={s.testimonial_images}>
                            <img
                                src={testimonials[prev].image}
                                alt="Previous client"
                                className={`${s.testimonial_image} ${s.image_top}`}
                                onClick={() => handleImageClick(prev)}
                            />
                            <div className={s.main_img}>
                                <img
                                    src={testimonials[current].image}
                                    alt="Current client"
                                    className={`${s.testimonial_image} ${s.image_main}`}
                                />
                                <svg width="86" height="8" viewBox="0 0 86 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="6" y1="4" x2="86" y2="4" stroke="#DFBFA8" strokeWidth="2" />
                                    <circle cx="4" cy="4" r="4" fill="#DFBFA8" />
                                </svg>
                            </div>
                            <img
                                src={testimonials[next].image}
                                alt="Next client"
                                className={`${s.testimonial_image} ${s.image_bottom}`}
                                onClick={() => handleImageClick(next)}
                            />
                        </div>
                        <div className={s.testimonial_info}>
                            <h3 className={s.client_name}>{testimonials[current].name}</h3>
                            <p className={s.client_status}>{testimonials[current].status}</p>
                            <p className={s.client_text}>
                                {testimonials[current].text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}