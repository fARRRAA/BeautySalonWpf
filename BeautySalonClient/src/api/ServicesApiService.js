import axios from 'axios';

export class ServicesApiService {
    constructor() {
        this.baseURL ="https://localhost:7165/api";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
    }

    async getServices(params = {}) {
        try {
            const response = await this.axiosInstance.get("/Services/all", { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

   
}

