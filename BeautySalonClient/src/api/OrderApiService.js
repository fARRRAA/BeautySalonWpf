import axios from 'axios';

export class OrderApiService {
    constructor() {
        this.baseURL = "https://localhost:7165/api/Orders";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    async getOrders(userId) {
        try {
            const response = await this.axiosInstance.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    

}
