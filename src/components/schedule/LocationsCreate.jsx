import { useEffect, useRef, useState, useCallback } from "react";
import * as trackasiagl from "trackasia-gl";
import "trackasia-gl/dist/trackasia-gl.css";
import { createTrip } from "../../api/trip";
import { createLocation } from "../../api/location";
import { searchLocation } from "../../api/map";
import { Search, ChevronLeft, Plus, Trash2, Pen, SaveAllIcon } from "lucide-react";

import { toast } from "react-toastify";
import LocationsCreatePreview from "./LocationsCreatePreview";
import LocationForm from "./LocationForm";

const MAPVN_TOKEN = import.meta.env.VITE_TRACKASIA_KEY;

const EMPTY_LOCATION = {
    tripId: null,
    name: "",
    description: "",
    lat: null,
    lon: null,
    address: "",
    visitedAt: "",
    tagsRequestList: [],
};

// helper
const extractLatLng = (place) => {
    if (place?.geometry?.location) {
        const loc = place.geometry.location;
        if (typeof loc.lat === "function") {
            return { lat: loc.lat(), lng: loc.lng() };
        }
        return { lat: loc.lat ?? place.geometry.lat, lng: loc.lng ?? place.geometry.lng };
    }
    return { lat: null, lng: null };
};

// custom hook quản lý markers
function useMapMarkers(mapRef, locations) {
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current) return;
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        locations.forEach((loc) => {
            if (loc.lat && loc.lon) {
                const marker = new trackasiagl.Marker({ color: "red" })
                    .setLngLat([loc.lon, loc.lat])
                    .addTo(mapRef.current);
                markersRef.current.push(marker);
            }
        });
    }, [locations]);

    return markersRef;
}

export default function LocationsMap({ trip, prevStep }) {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const selectedMarkerRef = useRef(null);
    const [locations, setLocations] = useState([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formLocation, setFormLocation] = useState(EMPTY_LOCATION);
    const [isMapVisible, setIsMapVisible] = useState(false); // Trạng thái hiển thị modal bản đồ

    useMapMarkers(mapRef, locations);

    const handleFinish = async () => {
        try {
            let tripId = trip?.id;

            // 1. Tạo Trip nếu chưa có ID
            if (!tripId) {
                if (!trip) throw new Error("Trip data is null or undefined");
                const tripRes = await createTrip(trip);
                if (tripRes.status !== 201 || !tripRes.data?.id) {
                    console.error("API response:", tripRes);
                    throw new Error("Failed to create trip. Please check the API response.");
                }
                tripId = tripRes.data.id;
            }

            // 2. Tạo Locations chỉ khi có Trip ID
            if (!tripId) throw new Error("Trip ID is missing");

            for (let loc of locations) {
                try {
                    if (!loc.name || !loc.lat || !loc.lon) {
                        console.warn("Skipping invalid location:", loc);
                        continue;
                    }
                    await createLocation({ ...loc, tripId });
                } catch (err) {
                    console.error(`Failed to create location: ${loc.name}`, err);
                    toast.error(`Failed to create location: ${loc.name}`);
                }
            }

            toast.success("Trip created successfully!");
        } catch (err) {
            console.error("Error in handleFinish:", err);
            toast.error("Error when saving trip & locations");
        }
    };

    // init map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new trackasiagl.Map({
            container: mapContainerRef.current,
            style: `https://maps.track-asia.com/styles/v2/streets.json?key=${MAPVN_TOKEN}`,
            center: [106.695723, 10.786618],
            zoom: 8,
        });

        mapRef.current.addControl(new trackasiagl.NavigationControl(), "top-right");

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    // search
    const handleSearch = async () => {
        if (!query) return;
        try {
            const res = await searchLocation(query);
            const results = res.data?.results || [];
            if (results.length === 0) {
                toast.info("No results found for your query.");
            }
            setResults(results);
        } catch (e) {
            console.error("Search error:", e);
            toast.error("Failed to search for locations. Please try again.");
        }
    };

    // chọn địa điểm
    const handleSelect = (place) => {
        if (!place) return;
        const { lat, lng } = extractLatLng(place);
        if (!lat || !lng) return;

        mapRef.current?.flyTo({ center: [lng, lat], zoom: 13, speed: 1.2 });

        if (selectedMarkerRef.current) {
            selectedMarkerRef.current.setLngLat([lng, lat]);
        } else {
            selectedMarkerRef.current = new trackasiagl.Marker({ color: "red" })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);
        }

        setFormLocation((prev) => ({
            ...prev,
            name: place.name || "",
            address: place.formatted_address || "",
            lat: lat,
            lon: lng,
        }));

        setQuery(place.formatted_address || place.name || "");
        setResults([]);
    };

    // reset form
    const resetForm = useCallback(() => {
        setFormLocation(EMPTY_LOCATION);
        setEditingIndex(null);
        setQuery("");
        if (selectedMarkerRef.current) {
            selectedMarkerRef.current.remove();
            selectedMarkerRef.current = null;
        }
    }, []);

    // add
    const handleAddLocation = () => {
        if (!formLocation.name || !formLocation.address) {
            toast.error("Please provide a valid name and address for the location.");
            return;
        }
        setLocations((prev) => [...prev, formLocation]);
        resetForm();
    };

    // edit
    const handleEdit = (idx) => {
        if (!locations[idx]) {
            console.warn("Invalid location index:", idx);
            return;
        }
        setEditingIndex(idx);
        setFormLocation({ ...locations[idx] });

        const loc = locations[idx];
        if (loc.lat && loc.lon) {
            if (selectedMarkerRef.current) {
                selectedMarkerRef.current.setLngLat([loc.lon, loc.lat]);
            } else {
                selectedMarkerRef.current = new trackasiagl.Marker({ color: "blue" })
                    .setLngLat([loc.lon, loc.lat])
                    .addTo(mapRef.current);
            }
        }
    };

    const handleSaveEdit = () => {
        setLocations((prev) => prev.map((loc, idx) => (idx === editingIndex ? formLocation : loc)));
        resetForm();
    };

    // delete
    const handleRemove = (index) => {
        setLocations((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="grid lg:grid-cols-5 gap-6 mt-2">
            {/* Form */}
            <LocationForm
                formLocation={formLocation}
                setFormLocation={setFormLocation}
                handleAddLocation={handleAddLocation}
                handleSaveEdit={handleSaveEdit}
                resetForm={resetForm}
                editingIndex={editingIndex}
            />

            {/* Map + Search box */}
            <div className="relative w-full h-[80vh] lg:col-span-3">
                {/* Search box */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-[400px]">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="flex items-center border-b">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Tìm kiếm địa điểm..."
                                className="w-full px-3 py-2 outline-none"
                            />
                            {query && (
                                <button
                                    onClick={() => resetForm()}
                                    className="px-2 text-gray-400 hover:text-black"
                                >
                                    ✕
                                </button>
                            )}
                            <button onClick={handleSearch} className="px-3 text-gray-600 hover:text-black">
                                <Search size={18} />
                            </button>
                        </div>
                        {results.length > 0 && (
                            <ul className="max-h-60 overflow-y-auto">
                                {results.map((place, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelect(place)}
                                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b text-sm"
                                    >
                                        <p className="font-medium">{place.name || "Không tên"}</p>
                                        <p className="text-gray-500">{place.formatted_address}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {/* Map container */}
                <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-md overflow-hidden" />
            </div>

            {/* Danh sách location*/}
            <div className="lg:col-span-5">
                <LocationsCreatePreview
                    trip={trip}
                    locations={locations}
                    handleEdit={handleEdit}
                    handleRemove={handleRemove}
                    editingIndex={editingIndex}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-between lg:col-span-5">
                <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 bg-vintageCream border border-vintageBrown/30 rounded-lg hover:bg-vintageBrown/20">
                    <ChevronLeft size={16} /> Quay lại
                </button>
                <button
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800">
                    <SaveAllIcon size={16} /> Tạo chuyến đi
                </button>
            </div>
        </div>
    );
}