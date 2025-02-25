import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080", // Cambia esta URL si tu backend está en otra dirección
    headers: {
        "Content-Type": "application/json",
    },
});
    
export default axiosInstance;
