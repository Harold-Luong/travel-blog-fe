import React from 'react';
import { searchLocationAutocomplete, searchLocation } from "../../../api/map";

export default function LocationSearch({ onLocationSelect = null, locationEdit = null }) {
    const [query, setQuery] = React.useState('');
    const [suggestions, setSuggestions] = React.useState([]);
    const [loadingSuggest, setLoadingSuggest] = React.useState(false);
    const [locationDetails, setLocationDetails] = React.useState();

    const handleSearch = async (query) => {
        try {
            const res = await searchLocationAutocomplete(query);
            setSuggestions(res.data?.predictions || []);
        } catch (e) {
            console.error(e);
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = async (description) => {
        try {
            const res = await searchLocation(description);
            if (res.data?.results?.length > 0) {
                const loc = res.data.results[0];

                const locationObj = {
                    name: loc.name,
                    address: loc.formatted_address,
                    latitude: loc.geometry.location.lat,
                    longitude: loc.geometry.location.lng,
                };

                setLocationDetails(locationObj);
                // immediately notify parent of the selected location
                onLocationSelect?.(locationObj);

            }
        } catch (err) {
            console.error("Error fetching location details:", err);
        }
        setSuggestions([]);
    };

    React.useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim() === '') {
                setSuggestions([]);
                return;
            }
            setLoadingSuggest(true);
            await handleSearch(query);
            setLoadingSuggest(false);
        };

        const delayDebounceFn = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleChange = (value) => {
        setQuery(value);
        setLocationDetails(null);
        onLocationSelect?.(null);
    };

    return (
        <div className="relative sm:col-span-1">
            <input
                type="text"
                placeholder="Địa chỉ"
                value={locationDetails ? locationDetails.name + " - " + locationDetails.address : (locationEdit ? locationEdit.name + " - " + locationEdit.address : query)}
                onChange={(e) => handleChange(e.target.value)}
                className="input-field text-sm w-full"
            />
            {loadingSuggest && (
                <div className="absolute right-2 top-2 text-gray-400 text-xs">...</div>
            )}
            {suggestions.length > 0 && (
                <ul className="z-10 bg-white border border-gray-200 rounded-lg shadow-md mt-1 max-h-40 overflow-auto w-full">
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelectSuggestion(s.description)}
                            className="px-2 py-1.5 hover:bg-amber-100 cursor-pointer text-xs text-gray-600"
                        >
                            📍 {s.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
