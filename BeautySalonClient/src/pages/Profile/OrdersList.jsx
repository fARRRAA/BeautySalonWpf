import React, { useState, useEffect } from 'react';
import { OrderApiService } from '../../api/OrderApiService';
import styles from './Profile.module.css';
import { Spin, Empty, Collapse, Badge, Tag, Divider } from 'antd';
import { ShoppingOutlined, CaretRightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

export const OrdersList = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const orderApi = new OrderApiService();

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getOrders(userId);
            setOrders(response);
            setLoading(false);
        } catch (err) {
            setError('Ошибка при загрузке заказов');
            setLoading(false);
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1: // создан
                return 'blue';
            case 2: // подтвержден
                return 'green';
            case 3: // в пути
                return 'orange';
            case 4: // доставлен
                return 'purple';
            case 5: // отменен
                return 'red';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <div className={styles.loading_container}>
                <Spin size="large" />
                <p>Загрузка заказов...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error_message}>{error}</div>;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className={styles.no_orders}>
                <Empty
                    description="У вас пока нет заказов"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <p>Вы можете сделать заказ в нашем каталоге товаров</p>
            </div>
        );
    }

    return (
        <div className={styles.orders_container}>
            <h2 className={styles.orders_title}>
                <ShoppingOutlined /> История заказов
            </h2>
            <p className={styles.orders_subtitle}>Всего заказов: {orders.length}</p>

            <Collapse
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className={styles.orders_collapse}
            >
                {orders.map((orderData) => {
                    const { order, products } = orderData;
                    return (
                        <Panel
                            key={order.id}
                            header={
                                <div className={styles.order_header}>
                                    <span className={styles.order_id}>
                                        Заказ #{order.id}
                                    </span>
                                    <span className={styles.order_date}>
                                        от {formatDate(order.date)}
                                    </span>
                                    <span className={styles.order_sum}>
                                        {order.discountSum} ₽
                                    </span>
                                    <Tag color={getStatusColor(order.statusId)}>
                                        {order.orderStatus.name}
                                    </Tag>
                                </div>
                            }
                            className={styles.order_panel}
                        >
                            <div className={styles.order_details}>
                                <div className={styles.order_info}>
                                    <div className={styles.order_info_item}>
                                        <span className={styles.info_label}>Статус заказа:</span>
                                        <Tag color={getStatusColor(order.statusId)} style={{width:'100px',textAlign:'center'}}>
                                            {order.orderStatus.name}
                                        </Tag>
                                    </div>
                                    <div className={styles.order_info_item}>
                                        <span className={styles.info_label}>Количество товаров:</span>
                                        <span>{order.count} шт.</span>
                                    </div>
                                    <div className={styles.order_info_item}>
                                        <span className={styles.info_label}>Сумма заказа:</span>
                                        <span className={styles.order_sum_value}>{order.sum} ₽</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className={styles.order_info_item}>
                                            <span className={styles.info_label}>Скидка:</span>
                                            <span className={styles.discount}>{order.discount}%</span>
                                        </div>
                                    )}
                                    {order.discount > 0 && (
                                        <div className={styles.order_info_item}>
                                            <span className={styles.info_label}>Итого со скидкой:</span>
                                            <span className={styles.discounted_sum}>{order.discountSum} ₽</span>
                                        </div>
                                    )}
                                </div>

                                <Divider orientation="left">Товары в заказе</Divider>

                                <div className={styles.products_list}>
                                    {products.map((item) => (
                                        <div className={styles.product_item} key={item.id}>
                                            <div className={styles.product_image_container}>
                                                <img 
                                                    src={item.products.photo} 
                                                    alt={item.products.name} 
                                                    className={styles.product_image}
                                                />
                                            </div>
                                            <div className={styles.product_details}>
                                                <div className={styles.product_name}>
                                                    {item.products.name}
                                                </div>
                                                <div className={styles.product_category}>
                                                    {item.products.typeProducts.name}
                                                </div>
                                                <div className={styles.product_price_info}>
                                                    <span className={styles.product_price}>
                                                        {item.products.price} ₽
                                                    </span>
                                                    <span className={styles.product_quantity}>
                                                        × {item.count} шт.
                                                    </span>
                                                    <span className={styles.product_total}>
                                                        = {item.products.price * item.count} ₽
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.order_footer}>
                                    <div className={styles.total_sum}>
                                        Итого: <span>{order.discountSum} ₽</span>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    );
                })}
            </Collapse>
        </div>
    );
}; 