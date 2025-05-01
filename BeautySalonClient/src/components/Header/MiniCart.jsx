import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useCartActions } from '../../hooks/useCartAction';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styles from './MiniCart.module.css';

export function MiniCart() {
    const { items, totalPrice, totalItems, loading, status } = useCart();
    const { removeFromCart, fetchUserCart } = useCartActions();
    const user = useAuth();
    const [localItems, setLocalItems] = useState([]);
    // Состояние для отслеживания товаров в процессе удаления
    const [removingItems, setRemovingItems] = useState([]);
    
    // Подписываемся на изменения состояния корзины
    const cartState = useSelector(state => state.cart);

    // Загружаем корзину при монтировании, если есть пользователь
    useEffect(() => {
        if (user && user.id) {
            fetchUserCart(user.id);
        }
    }, [user, fetchUserCart]);

    // Синхронизируем localItems с items из Redux при каждом изменении cartState
    useEffect(() => {
        // Обновляем локальные данные только из успешных запросов
        if (cartState.status !== 'failed') {
            setLocalItems(cartState.items);
            // Очищаем список удаляемых элементов, если запрос успешен
            if (cartState.status === 'succeeded') {
                setRemovingItems([]);
            }
        }
    }, [cartState.items, cartState.status]);

    // Отслеживаем ошибки
    useEffect(() => {
        if (cartState.status === 'failed' && cartState.error) {
            console.error('Ошибка корзины:', cartState.error);
            // Можно добавить уведомление пользователя об ошибке
        }
    }, [cartState.status, cartState.error]);

    // Рассчитываем локальные значения с использованием useMemo для оптимизации
    const displayItems = useMemo(() => {
        // Фильтруем элементы, которые в процессе удаления
        return localItems.filter(item => !removingItems.includes(item.id));
    }, [localItems, removingItems]);
    
    const localTotalItems = useMemo(() =>
        displayItems.reduce((acc, item) => acc + item.count, 0),
        [displayItems]
    );
    
    const localTotalPrice = useMemo(() =>
        displayItems.reduce((acc, item) => acc + (item.price * item.count), 0),
        [displayItems]
    );

    // Оптимизируем функцию удаления с помощью useCallback
    const handleRemoveItem = useCallback((productId) => {
        if (user && user.id) {
            // Добавляем товар в список удаляемых
            setRemovingItems(prev => [...prev, productId]);
            
            // Отправляем запрос на сервер
            removeFromCart({ userId: user.id, productId });
        }
    }, [user, removeFromCart]);

    if (loading && displayItems.length === 0) {
        return (
            <div className={styles.miniCart}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    if (displayItems.length === 0) {
        return (
            <div className={styles.miniCart}>
                <div className={styles.emptyCart}>
                    <p>Ваша корзина пуста</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.miniCart}>
            <div className={styles.miniCartHeader}>
                <h4>Корзина</h4>
                <span>{displayItems.length} {displayItems.length === 1 ? 'товар' : (displayItems.length >= 2 && displayItems.length <= 4) ? 'товара' : 'товаров'}</span>
            </div>
            <div className={styles.miniCartItems}>
                {displayItems.slice(0, 3).map(item => (
                    <div key={item.id} className={styles.miniCartItem}>
                        <div className={styles.itemInfo}>
                            <h5>{item.name}</h5>
                            <div className={styles.itemDetails}>
                                <span>{item.count} x {item.price} ₽</span>
                            </div>
                        </div>
                        <button 
                            className={styles.removeBtn} 
                            onClick={() => handleRemoveItem(item.id)}
                            title="Удалить из корзины"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                
                {displayItems.length > 3 && (
                    <div className={styles.moreItems}>
                        <p>И еще {displayItems.length - 3} {(displayItems.length - 3) === 1 ? 'товар' : (displayItems.length - 3 >= 2 && displayItems.length - 3 <= 4) ? 'товара' : 'товаров'}</p>
                    </div>
                )}
            </div>
            <div className={styles.miniCartFooter}>
                <div className={styles.total}>
                    <span>Итого:</span>
                    <span className={styles.totalPrice}>{localTotalPrice} ₽</span>
                </div>
                <Link to="/cart" className={styles.viewCartBtn}>
                    Перейти в корзину
                </Link>
            </div>
        </div>
    );
} 