import axios from 'axios';

export class ProductsApiService {
    constructor() {
        this.baseURL ="https://localhost:7165/api/Products";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
    }

    async getProducts(params = {}) {
        try {
            const response = await this.axiosInstance.get("/all", { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getTypes(params={}){
        try {
            const response=await this.axiosInstance.get("/types",{params});
            return response.data;
        }
        catch(error){
            throw error;
        }
    }
   
}

