import axios from 'axios';
const TRACKASIA_KEY = import.meta.env.VITE_TRACKASIA_KEY;

export const searchLocation = async (query) => {
    try {
        const res = await axios.get("https://maps.track-asia.com/api/v2/place/textsearch/json", {
            params: { new_admin: true, query: query, key: TRACKASIA_KEY },
        });
        return res;

    } catch (error) {
        console.error(error);
        throw error;
    }
}