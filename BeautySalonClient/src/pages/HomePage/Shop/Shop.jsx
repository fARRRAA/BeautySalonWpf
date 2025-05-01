import s from './Shop.module.css'
import { useEffect, useState, useCallback } from 'react';
import { ProductsApiService } from '../../../api/ProductsApiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { useCartActions } from '../../../hooks/useCartAction';
import { useSelector } from 'react-redux';

export function Shop() {
    const messageError = (text) => {
        toast.error(text, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true
        });
    };
    
    const messageWarning = (text) => {
        toast.warning(text, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true
        });
    };
    
    const messageSuccess = (text) => {
        toast.success(text, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true
        });
    };
    
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const api = new ProductsApiService();
    const user = useAuth();
    const { items } = useCart();
    const { addToCart } = useCartActions();
    // Локальное состояние для отслеживания добавленных товаров
    const [addedProducts, setAddedProducts] = useState([]);
    // Отслеживаем состояние корзины для своевременного обновления UI
    const cartState = useSelector(state => state.cart);
    // Состояние для отслеживания товаров в процессе добавления
    const [addingProducts, setAddingProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                var result = await api.getProducts();
                setData(result);
            } catch (err) {
                setError(err);
                messageError("Ошибка при загрузке товаров");
            }
        };
        fetchProducts();
    }, []);

    // Обновляем локальное состояние на основе корзины из Redux
    useEffect(() => {
        const productIds = items.map(item => item.id);
        setAddedProducts(productIds);
        // Когда товар успешно добавлен, удаляем его из состояния "в процессе добавления"
        setAddingProducts(prev => prev.filter(id => !productIds.includes(id)));
    }, [items]);

    // Отслеживаем изменения статуса корзины для обработки ошибок
    useEffect(() => {
        // Если статус изменился с loading на failed, значит возникла ошибка
        if (cartState.status === 'failed' && addingProducts.length > 0) {
            messageError("Ошибка при обновлении корзины");
            // Очищаем состояние "в процессе добавления"
            setAddingProducts([]);
        }
    }, [cartState.status, addingProducts]);

    // Оптимизируем функцию проверки наличия товара в корзине с использованием callback
    const isInCart = useCallback((productId) => {
        return addedProducts.includes(productId) || addingProducts.includes(productId);
    }, [addedProducts, addingProducts]);

    const filterBest = () => {
        const filtered = [...data].sort((a, b) => b.productId - a.productId).slice(0, 4);
        return filtered;
    };

    const handleAddToCart = (product) => {
        if (!user || !user.id) {
            messageWarning("Необходимо авторизоваться для добавления товаров в корзину");
            return;
        }

        // Проверка, есть ли товар уже в корзине
        const itemInCart = items.find(item => item.id === product.productId);
        
        if (itemInCart) {
            // Если товар уже в корзине, не выполняем никаких действий
            messageWarning("Товар уже добавлен в корзину");
            return;
        } else {
            // Немедленно обновляем локальное состояние - добавляем в список "в процессе добавления"
            setAddingProducts(prev => [...prev, product.productId]);
            
            // Добавляем товар в корзину
            addToCart({
                userId: user.id,
                productId: product.productId,
                count: 1
            });
            messageSuccess(`Товар "${product.name}" добавлен в корзину`);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className={s.shop}>
                <div className="container">
                    <div className={s.shop_inner}>
                        <p className={s.services_title}>Наш магазин</p>
                        <p className={s.services_subtitle}>В нашем каталоге вы найдете все необходимое для безупречного макияжа, здоровых волос и идеального ухода за кожей.</p>
                        <div className={s.shop_wrapper}>
                            {
                                data ? 
                                data.filter(x=>x.price>500)
                                .slice(0,4).map(item => (
                                    <div className={s.shop_item} key={item.productId}>
                                        <img src={item.photo} alt={item.name} className={s.item_img} />
                                        <p className={s.item_name}>{item.name}</p>
                                        <p className={s.item_type}>{item.typeProducts.name}</p>
                                        <p className={s.item_price}>{item.price} ₽</p>
                                        <div className={s.stock_and_cart}>
                                            <button 
                                                className={`${s.add_to_cart_btn} ${isInCart(item.productId) ? s.in_cart : ''}`}
                                                onClick={() => handleAddToCart(item)}
                                                disabled={isInCart(item.productId)}
                                            >
                                                {isInCart(item.productId) 
                                                    ? "В корзине" 
                                                    : "В корзину"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                ))
                                : <p>Товары не найдены</p>
                            }
                        </div>
                        <Link to="/services#catalog" className={s.view_all}>Посмотреть все</Link>
                    </div>
                </div>
            </div>
        </>
    )
}