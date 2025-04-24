import axios from 'axios';

export class AuthApiService {
    constructor() {
        this.baseURL ="https://localhost:7165/api/Clients";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
    }
    async checkUser(mail){
        try {
            const response = await this.axiosInstance.get(`/client/exists/${mail}`, { });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async login(data){
        let params={
            email:data
        };
        try {
            const response = await this.axiosInstance.get(`/login`,{params});
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async register(data){
        try {
            const response = await this.axiosInstance.post('/register', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async confirmCode(data){
        try {
            const response = await this.axiosInstance.post('/email-confirm', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getUserById(id){
        try {
            const response = await this.axiosInstance.get(`/client/${id}`, { });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getUserByEmail(email){
        try {
            const response = await this.axiosInstance.get(`/client/email/${email}`, { });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

