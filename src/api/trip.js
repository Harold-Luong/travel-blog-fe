// create functions to handle trip-related API requests
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/travel-blog/trip';
const token = localStorage.getItem("accessToken");

// get trip by page and size
export const fetchTrips = async (page, size) => {
    try {
        //Backend Default to fetching all trips for the user with: "page": 0, "size": 6
        const response = await axios.get(`${API_URL}/my-trip?page=${page}&size=${size}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;

    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
}

export const updateTrip = async (id, tripData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, tripData, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error(`Error updating trip with id ${id}:`, error);
        throw error;
    }
}

export const deleteTrip = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error(`Error deleting trip with id ${id}:`, error);
        throw error;
    }
}

// Fetch trip details by ID
export const fetchTripDetailsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/details/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error(`Error fetching trip details for id ${id}:`, error);
        throw error;
    }
}

export const fetchTripDetailsBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/${slug}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error(`Error fetching trip details for id ${slug}:`, error);
        throw error;
    }
}

// Fetch trip details by ID
export const fetchTripDetailsByUser = async () => {
    try {
        const url = "http://localhost:8080/api/travel-blog/travel-itinerary/all";
        const response = await axios.get(`${url}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        console.error(`Error fetching all trip:`, error);
        throw error;
    }
}

export const createTravelItinerary = async (tripData) => {
    const url = 'http://localhost:8080/api/travel-blog/travel-itinerary'
    try {
        const response = await axios.post(url, tripData, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        console.log("response", response)
        return response;
    } catch (error) {
        console.error('Error creating travel-itinerary:', error);
        throw error;
    }
}