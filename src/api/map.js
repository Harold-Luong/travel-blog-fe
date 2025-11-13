import axios from 'axios';
const TRACKASIA_KEY = import.meta.env.VITE_TRACKASIA_KEY;

export const searchLocation = async (query) => {
    try {
        const res = await axios.get("https://maps.track-asia.com/api/v2/place/textsearch/json", {
            params: { new_admin: true, query: query, include_old_admin: true, key: TRACKASIA_KEY },
        });
        return res;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const searchLocationDetails = async (query) => {
    try {
        const res = await axios.get("https://maps.track-asia.com/api/v2/place/textsearch/json", {
            params: { new_admin: true, query: query, include_old_admin: true, key: TRACKASIA_KEY },
        });
        return res;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const searchLocationAutocomplete = async (query) => {
    //https://maps.track-asia.com/api/v2/place/autocomplete/json?input=Landmark 81&size=2&key=public_key&new_admin=true&include_old_admin=true
    try {
        const res = await axios.get("https://maps.track-asia.com/api/v2/place/autocomplete/json", {
            params: { input: query, key: TRACKASIA_KEY, new_admin: true, include_old_admin: true },
        });
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

