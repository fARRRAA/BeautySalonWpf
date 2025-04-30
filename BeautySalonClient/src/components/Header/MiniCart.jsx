import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import styles from './MiniCart.module.css';

export function MiniCart() {
    const { items, totalPrice, loading } = useCart();

    if (loading) {
        return (
            <div className={styles.miniCart}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    if (items.length === 0) {
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
                <span>{items.length} {items.length === 1 ? 'товар' : (items.length >= 2 && items.length <= 4) ? 'товара' : 'товаров'}</span>
            </div>
            <div className={styles.miniCartItems}>
                {items.slice(0, 3).map(item => (
                    <div key={item.id} className={styles.miniCartItem}>
                        <div className={styles.itemInfo}>
                            <h5>{item.name}</h5>
                            <div className={styles.itemDetails}>
                                <span>{item.count} x {item.price} ₽</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {items.length > 3 && (
                    <div className={styles.moreItems}>
                        <p>И еще {items.length - 3} {(items.length - 3) === 1 ? 'товар' : (items.length - 3 >= 2 && items.length - 3 <= 4) ? 'товара' : 'товаров'}</p>
                    </div>
                )}
            </div>
            <div className={styles.miniCartFooter}>
                <div className={styles.total}>
                    <span>Итого:</span>
                    <span className={styles.totalPrice}>{totalPrice} ₽</span>
                </div>
                <Link to="/cart" className={styles.viewCartBtn}>
                    Перейти в корзину
                </Link>
            </div>
        </div>
    );
} 