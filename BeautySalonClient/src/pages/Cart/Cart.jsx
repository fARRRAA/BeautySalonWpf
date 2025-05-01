import { useEffect, useState, useMemo } from 'react';
import { useCart } from '../../hooks/useCart';
import { useCartActions } from '../../hooks/useCartAction';
import { useSelector } from 'react-redux';
import styles from './Cart.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export function Cart() {
    const { items, totalPrice, loading, error, userId, totalItems } = useCart();
    const { fetchUserCart, increaseProductCount, decreaseProductCount, removeFromCart, clearUserCart } = useCartActions();
    const user = useAuth();
    const [localItems, setLocalItems] = useState([]);

    const cartState = useSelector(state => state.cart);
    //console.log(cartState);
    useEffect(() => {
        if (user && user.id) {
            fetchUserCart(user.id);
        }
    }, [user, fetchUserCart]);

    const totalCount = useMemo(() => 
        items.reduce((acc, item) => acc + item.count, 0), 
        [items]
    );

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleIncreaseCount = (productId) => {
        if (user && user.id) {
            // Находим текущий товар
            const currentItem = localItems.find(item => item.id === productId);

            // Проверяем, не превышаем ли лимит наличия на складе
            // Используем значение inStock из самого товара
            if (currentItem && currentItem.count >= currentItem.inStock) {
                toast.warning(`Нельзя добавить больше товара, чем имеется на складе (${currentItem.inStock} шт.)`);
                return;
            }

            // Обновляем локальное состояние для мгновенной реакции UI
            setLocalItems(prevItems => prevItems.map(item =>
                item.id === productId
                    ? { ...item, count: item.count + 1 }
                    : item
            ));

            // Отправляем запрос на сервер
            increaseProductCount({ userId: user.id, productId });
        }
    };

    const handleDecreaseCount = (productId) => {
        if (user && user.id) {
            // Находим текущий товар
            const currentItem = localItems.find(item => item.id === productId);

            // Если количество больше 1, уменьшаем локально
            if (currentItem && currentItem.count > 1) {
                setLocalItems(prevItems => prevItems.map(item =>
                    item.id === productId
                        ? { ...item, count: item.count - 1 }
                        : item
                ));
            }

            // Отправляем запрос на сервер
            decreaseProductCount({ userId: user.id, productId });
        }
    };

    const handleRemoveItem = (productId) => {
        if (user && user.id) {
            // Удаляем товар из локального состояния
            setLocalItems(prevItems => prevItems.filter(item => item.id !== productId));

            // Отправляем запрос на сервер
            removeFromCart({ userId: user.id, productId });
        }
    };

    const localTotalPrice = useMemo(() =>
        localItems.reduce((acc, item) => acc + (item.price * item.count), 0),
        [localItems]
    );

    const canIncreaseCount = (item) => {
        return item.count < item.inStock;
    };

    if (loading && localItems.length === 0) {
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

    if (!localItems || localItems.length === 0) {
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
    async function CreateOrder() {
        const totalCount = localItems.reduce((acc, item) => acc + item.count, 0);
        
        const orderData = {
            clientId: user.id,
            sum: localTotalPrice,
            count: totalCount,
            items: localItems.map(item => {
                return {
                    productId: item.id,
                    count: item.count,
                }
            })
        };
        try {
            const res = await fetch("https://localhost:7165/api/Orders/add", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            if (res.status === 200) {
                toast.success("Заказ успешно оформлен");

                setTimeout(async () => {
                    await clearUserCart(user.id);
                    setLocalItems([]);
                }, 1500);
            } else {
                toast.error("Ошибка при оформлении заказа");
            }
            console.log(res);
        } catch (error) {
            toast.error("Ошибка при оформлении заказа: " + error.message);
            console.error(error);
        }
    }
    return (
        <div className="container">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className={styles.cartPage}>
                <h1>Корзина</h1>
                <div className={styles.cartItems}>
                    {localItems.map(item => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.itemInfo}>
                                <h3>{item.name}</h3>
                                <p className={styles.itemDescription}>{item.description}</p>
                                <p className={styles.itemStock}>
                                    В наличии: {item.inStock} шт.
                                </p>
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
                                        disabled={!canIncreaseCount(item)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className={styles.price}>
                                    {item.price * item.count} ₽
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className={styles.removeBtn}
                                    title="Удалить из корзины"
                                > ✕</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.cartSummary}>
                    <div className={styles.totalPrice}>
                        <span>Итого:</span>
                        <span>{localTotalPrice} ₽</span>
                    </div>
                    <button className={styles.checkoutBtn} onClick={CreateOrder}>Оформить заказ</button>
                </div>
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </div>

    );
} 