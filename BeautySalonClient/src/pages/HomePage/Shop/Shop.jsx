import s from './Shop.module.css'
import { useEffect, useState } from 'react';
import { ProductsApiService } from '../../../api/ProductsApiService';
import { toast, ToastContainer } from 'react-toastify';
export function Shop() {

    const messageError = (error) => {
        toast.error(error, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            // pauseOnHover: true,
            draggable: true
        });
    };
    const messageWarning = (error) => {
        toast.warning(error, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            // pauseOnHover: true,
            draggable: true
        });
    };
    const messageSuccess = (error) => {
        toast.success(error, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            // pauseOnHover: true,
            draggable: true
        });
    };
    const [data, setData] = useState();
    const [error, setError] = useState(null);
    const api = new ProductsApiService();


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                var result = await api.getProducts();
                setData(result);
            } catch (err) {
                setError(err);
            }
        };
        fetchProducts();
    }, []);


    return (
        <>
            <ToastContainer />
            <div className={s.shop}>
                <div className="container">
                    <div className={s.shop_inner}>
                        <p className={s.services_title}>Our shop</p>
                        <p className={s.services_subtitle}>Eleifend arcu non lorem justo in tempus purus gravida. Est tortor egestas sed feugiat </p>
                        <div className={s.shop_wrapper}>
                            {
                                data? 
                                data.slice(0,4).map(item => (
                                    <div className={s.shop_item} key={item.productId}>
                                        <img src={item.photo} className={s.item_img}></img>
                                        <p className={s.item_name}>{item.name}</p>
                                        <p className={s.item_type}>{item.typeProducts.name}</p>
                                        <p className={s.item_price}>{item.price} ₽</p>
                                    </div>
                                ))
                                :<p>pipec</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}