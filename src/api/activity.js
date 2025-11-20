
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/travel-blog/activity';
const token = localStorage.getItem("accessToken");

export const updatStatusActivity = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, status, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;

    } catch (error) {
        console.error('Error update activity satus:', error);
        throw error;
    }
}
