import axios from 'axios';

export class AppointmentApiService {
    constructor() {
        this.baseURL = "https://localhost:7165/api/Appointments";
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    async getTimeSlots(params = {}) {
        try {
            const response = await this.axiosInstance.get("/timeslots", { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createAppointment(data) {
        try {
            // Преобразуем данные в формат, ожидаемый бэкендом
            const appointmentData = {
                masterId: data.masterId,
                timeStart: data.timeStart,
                timeEnd: data.timeEnd,
                totalSum: data.totalSum,
                totalDuration: data.totalDuration,
                date: data.date,
                clientId: data.clientId
            };

            const response = await this.axiosInstance.post("", appointmentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAppointmentsByClient(clientId) {
        try {
            const response = await this.axiosInstance.get(`/client/${clientId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async cancelAppointment(appointmentId) {
        try {
            const response = await this.axiosInstance.put(`/${appointmentId}/cancel`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

