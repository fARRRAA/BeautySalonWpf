import axios from 'axios';

export class MastersApiService {
    constructor() {
        this.baseURL = "https://localhost:7165/api";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

    }

    async getMasters(params = {}) {
        try {
            const response = await this.axiosInstance.get("/Masters/all", { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getMaster(id) {
        try {
            const response = await this.axiosInstance.get(`/Masters/master/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

