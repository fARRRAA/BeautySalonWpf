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
            const response = await this.axiosInstance.get(`/cart/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async increaseProductCount(userId, productId) {
        try {
            const response = await this.axiosInstance.get(`/cart/${userId}/product/${productId}/inc`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async decreaseProductCount(userId, productId) {
        try {
            const response = await this.axiosInstance.get(`/cart/${userId}/product/${productId}/dec`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async removeFromCart(userId, productId) {
        try {
            const response = await this.axiosInstance.delete(`/cart/${userId}/product/${productId}/del`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async addToCart(data) {
        try {
            const cartData = {
                userId: data.userId,
                productId: data.productId,
                count: data.count
            };
            const response = await this.axiosInstance.post(`/cart/add`, cartData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async clearCart(userId) {
        try {
            const response = await this.axiosInstance.delete(`/cart/${userId}/clear`);
            return response.data;
        } catch (error) {
            throw error;    
        }
    }
}
