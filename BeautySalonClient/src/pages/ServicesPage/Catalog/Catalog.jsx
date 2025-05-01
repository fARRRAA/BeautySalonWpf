import s from './Catalog.module.css'
import { useEffect, useState, useCallback } from 'react';
import { ProductsApiService } from '../../../api/ProductsApiService';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { useCartActions } from '../../../hooks/useCartAction';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Catalog() {
    const [allProducts, setAllProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [types, setTypes] = useState();
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(2);
    const api = new ProductsApiService();
    const user = useAuth();
    const { items } = useCart();
    const { addToCart, removeFromCart } = useCartActions();
    // Локальное состояние для отслеживания добавленных товаров
    const [addedProducts, setAddedProducts] = useState([]);
    // Отслеживаем состояние корзины для своевременного обновления UI
    const cartState = useSelector(state => state.cart);
    // Состояние для отслеживания товаров в процессе добавления
    const [addingProducts, setAddingProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await api.getProducts();
                setAllProducts(result);
                setFilteredProducts(result.filter(x => x.typeId === selectedId));
            } catch (err) {
                setError(err);
                toast.error("Ошибка при загрузке товаров");
            }
        };

        const fetchTypes = async () => {
            try {
                const result = await api.getTypes();
                setTypes(result);
            } catch (err) {
                setError(err);
                toast.error("Ошибка при загрузке категорий");
            }
        };

        fetchProducts();
        fetchTypes();
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
            toast.error("Ошибка при обновлении корзины");
            // Очищаем состояние "в процессе добавления"
            setAddingProducts([]);
        }
    }, [cartState.status, addingProducts]);

    const filterProducts = (id) => {
        setSelectedId(id);
        const filtered = allProducts.filter(x => x.typeId === id);
        setFilteredProducts(filtered);
    };

    // Оптимизируем функцию проверки наличия товара в корзине с использованием callback
    const isInCart = useCallback((productId) => {
        return addedProducts.includes(productId) || addingProducts.includes(productId);
    }, [addedProducts, addingProducts]);

    const handleAddToCart = (product) => {
        if (!user || !user.id) {
            toast.warning("Необходимо авторизоваться для добавления товаров в корзину");
            return;
        }

        // Проверка, есть ли товар уже в корзине
        const itemInCart = items.find(item => item.id === product.productId);
        
        if (itemInCart) {
            // Если товар уже в корзине, не выполняем никаких действий
            toast.warning("Товар уже добавлен в корзину");
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
            toast.success(`Товар "${product.name}" добавлен в корзину`);
        }
    };

    // Функция для удаления товара из корзины (если понадобится)
    const handleRemoveFromCart = (productId) => {
        if (user && user.id) {
            // Немедленно обновляем локальное состояние
            setAddedProducts(prev => prev.filter(id => id !== productId));
            
            // Отправляем запрос на сервер
            removeFromCart({ userId: user.id, productId });
            toast.info("Товар удален из корзины");
        }
    };

    return (
        <div className={s.catalog} id="catalog">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="container">
                <div className={s.catalog_inner}>
                    <p className={s.title}>Наши товары</p>
                    <p className={s.subtitle}> </p>
                    <div className={s.catalog_filter}>
                        {types ? 
                            types.map(type => (
                                <button key={type.typeId} onClick={() => filterProducts(type.typeId)}>
                                    <p className={`${s.type_name} ${selectedId === type.typeId ? s.active : ""}`}>
                                        {type.name}
                                    </p>
                                </button>
                            ))
                            : <p>{error}</p>
                        }
                    </div>
                    <div className={s.catalog_wrapper}>
                        {filteredProducts ? 
                            filteredProducts.map(item => (
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
                            : <p>{error}</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}