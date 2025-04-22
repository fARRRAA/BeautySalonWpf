import s from './Catalog.module.css'
import { useEffect, useState } from 'react';
import { ProductsApiService } from '../../../api/ProductsApiService';

export function Catalog() {
    const [allProducts, setAllProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [types, setTypes] = useState();
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(2);
    const api = new ProductsApiService();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await api.getProducts();
                setAllProducts(result);
                setFilteredProducts(result.filter(x => x.typeId === selectedId));
            } catch (err) {
                setError(err);
            }
        };

        const fetchTypes = async () => {
            try {
                const result = await api.getTypes();
                setTypes(result);
            } catch (err) {
                setError(err);
            }
        };

        fetchProducts();
        fetchTypes();
    }, []);

    const filterProducts = (id) => {
        setSelectedId(id);
        const filtered = allProducts.filter(x => x.typeId === id);
        setFilteredProducts(filtered);
    };

    return (
        <div className={s.catalog}>
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