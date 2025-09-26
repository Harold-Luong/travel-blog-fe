// create functions to handle trip-related API requests
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/travel-blog/locations';

// get all locations
// http://localhost:8080/api/travel-blog/locations?page=0&size=6
// If no page or size is provided, it defaults to page 0 and size 6
export const fetchLocations = async (userId, page = 0, size = 6) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw error;
    }
}

// get location by ID
// http://localhost:8080/api/travel-blog/locations/1
export const fetchLocationById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching location with ID ${id}:`, error);
        throw error;
    }
}

// create a new location
// http://localhost:8080/api/travel-blog/locations
export const createLocation = async (locationData) => {
    try {
        const response = await axios.post(API_URL, locationData);
        return response.data;
    } catch (error) {
        console.error("Error creating location:", error);
        throw error;
    }
}

// update an existing location
// http://localhost:8080/api/travel-blog/locations/1
export const updateLocation = async (id, locationData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, locationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating location with ID ${id}:`, error);
        throw error;
    }
}

// delete a location
// http://localhost:8080/api/travel-blog/locations/1
export const deleteLocation = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting location with ID ${id}:`, error);
        throw error;
    }
}

// get locations by trip ID
// http://localhost:8080/api/travel-blog/locations/trip/1?page=0&size=10
export const fetchLocationsByTripId = async (tripId, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/trip/${tripId}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching locations for trip ID ${tripId}:`, error);
        throw error;
    }
}
// search locations by name
// http://localhost:8080/api/travel-blog/locations/search?name=Paris&page=0&size=10
export const searchLocationsByName = async (name, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: { name, page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error searching locations by name "${name}":`, error);
        throw error;
    }
}

// get locations by tag slug
// http://localhost:8080/api/travel-blog/locations/tag/adventure?page=0&size=10
export const fetchLocationsByTagSlug = async (slug, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/tag/${slug}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching locations by tag slug "${slug}":`, error);
        throw error;
    }
}

