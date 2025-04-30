import { useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useCartActions } from '../../hooks/useCartAction';
import { useSelector } from 'react-redux';
import styles from './Cart.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'

export function Cart() {
    const { items, totalPrice, loading, error, cartId } = useCart();
    const { fetchUserCart, increaseProductCount, decreaseProductCount } = useCartActions();
    const user = useAuth();

    // Добавим логирование состояния корзины для отладки
    const cartState = useSelector(state => state.cart);
    console.log('Cart state:', cartState);

    useEffect(() => {
        if (user && user.id) {
            console.log('Loading cart for user ID:', user.id);
            fetchUserCart(user.id);
        } else {
            console.log('No user ID available for cart loading');
        }
    }, [user, fetchUserCart]);
    console.log(items)
    const handleIncreaseCount = (productId) => {
        // Проверяем наличие user.id, т.к. cartId может быть не установлен правильно
        if (user && user.id) {
            console.log('Increasing product count for productId:', productId, 'userId:', user.id);
            // Используем user.id вместо cartId
            increaseProductCount({ userId: user.id, productId });
        } else {
            console.log('Cannot increase count - no user ID available');
        }
    };

    const handleDecreaseCount = (productId) => {
        // Проверяем наличие user.id, т.к. cartId может быть не установлен правильно
        if (user && user.id) {
            console.log('Decreasing product count for productId:', productId, 'userId:', user.id);
            // Используем user.id вместо cartId
            decreaseProductCount({ userId: user.id, productId });
        } else {
            console.log('Cannot decrease count - no user ID available');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className={styles.loading}>Загрузка корзины...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className={styles.error}>
                    <h3>Ошибка при загрузке корзины:</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="container">
                <div className={styles.emptyCart}>
                    <h2>Ваша корзина пуста</h2>
                    <p>Добавьте товары, чтобы продолжить</p>
                    <Link to="/services" className={styles.linkToServices}>
                        <button className={styles.btnServices}>Перейти к товарам</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className={styles.cartPage}>
                <h1>Корзина</h1>
                <div className={styles.cartItems}>
                    {items.map(item => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.itemInfo}>
                                <h3>{item.name}</h3>
                                <p className={styles.itemDescription}>{item.description}</p>
                            </div>
                            <div className={styles.itemControls}>
                                <div className={styles.quantity}>
                                    <button
                                        onClick={() => handleDecreaseCount(item.id)}
                                        className={styles.quantityBtn}
                                        disabled={item.count <= 1}
                                    >
                                        -
                                    </button>
                                    <span className={styles.count}>{item.count}</span>
                                    <button
                                        onClick={() => handleIncreaseCount(item.id)}
                                        className={styles.quantityBtn}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className={styles.price}>
                                    {item.price * item.count} ₽
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.cartSummary}>
                    <div className={styles.totalPrice}>
                        <span>Итого:</span>
                        <span>{totalPrice} ₽</span>
                    </div>
                    <button className={styles.checkoutBtn}>Оформить заказ</button>
                </div>
            </div>
        </div>
    );
} 