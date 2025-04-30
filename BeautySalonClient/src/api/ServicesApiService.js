import axios from 'axios';

export class ServicesApiService {
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

    async getAll(params = {}) {
        try {
            const response = await this.axiosInstance.get("/Services/all", { params });
            // Преобразуем данные в формат, удобный для фронтенда
            const transformedData = response.data.map(item => ({
                id: item.id,
                serviceId: item.serviceId,
                skillId: item.skillId,
                name: item.services.serviceName,
                description: `Длительность: ${item.runTime} мин, Цена: ${item.price} ₽`,
                price: item.price,
                duration: item.runTime,
                skillLevel: {
                    id: item.skillId,
                    name: item.mastersSkills.name,
                    rate: item.mastersSkills.rate
                },
                service: {
                    id: item.serviceId,
                    name: item.services.serviceName,
                    juniorRunTime: item.services.juniorRunTime,
                    middleRunTime: item.services.middleRunTime,
                    seniorRunTime: item.services.seniorRunTime,
                    juniorPrice: item.services.juniorPrice,
                    middlePrice: item.services.middlePrice,
                    seniorPrice: item.services.seniorPrice
                },
                typeService:{
                    id:item.services.typeServices.id,
                    name:item.services.typeServices.name
                }
            }));
            return transformedData;
        } catch (error) {
            throw error;
        }
    }
}

