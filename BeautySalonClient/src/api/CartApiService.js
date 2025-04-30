import axios from 'axios';

export class CartApiService {
    constructor() {
        this.baseURL = "https://localhost:7165/api/Cart";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    async getUserCart(userId) {
        try {
            console.log('Getting cart for userId:', userId);
            const response = await this.axiosInstance.get(`/cart/${userId}`);
            console.log('Cart API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    }

    async increaseProductCount(userId, productId) {
        try {
            console.log('Increasing product count:', userId, productId);
            const response = await this.axiosInstance.get(`/cart/${userId}/product/${productId}/inc`);
            console.log('Increase API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error increasing count:', error);
            throw error;
        }
    }

    async decreaseProductCount(userId, productId) {
        try {
            console.log('Decreasing product count:', userId, productId);
            const response = await this.axiosInstance.get(`/cart/${userId}/product/${productId}/dec`);
            console.log('Decrease API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error decreasing count:', error);
            throw error;
        }
    }

    async addToCart(data) {
        try {
            console.log('Adding to cart:', data);
            const cartData = {
                userId: data.userId,
                productId: data.productId,
                count: data.count
            };
            const response = await this.axiosInstance.post(`/cart/add`, cartData);
            console.log('Add to cart API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }
}
