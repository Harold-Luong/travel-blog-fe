// create functions to handle trip-related API requests
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/travel-blog/trip';

export const fetchTrips = async (idUser, page, size) => {
    try {
        if (idUser) {
            if (page === undefined || size === undefined) {
                // Default to fetching all trips for the user with:    "page": 0, "size": 6
                const response = await axios.get(`${API_URL}/user/${idUser}`);
                return response.data;
            }
            const response = await axios.get(`${API_URL}/user/${idUser}?page=${page}&size=${size}`);
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
}

export const createTrip = async (tripData) => {
    try {
        const response = await axios.post(API_URL, tripData);
        return response;
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
}

export const updateTrip = async (id, tripData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, tripData);
        return response;
    } catch (error) {
        console.error(`Error updating trip with id ${id}:`, error);
        throw error;
    }
}

export const deleteTrip = async (id) => {

    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting trip with id ${id}:`, error);
        throw error;
    }
}

// Fetch trip details by ID
export const fetchTripDetailsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/details/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching trip details for id ${id}:`, error);
        throw error;
    }
}