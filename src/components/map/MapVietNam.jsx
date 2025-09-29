import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "trackasia-gl/dist/trackasia-gl.css";
import * as trackasiagl from "trackasia-gl";
import { toast } from "react-toastify";
import { Search, Crosshair } from "lucide-react";
import { searchLocation } from "../../api/map";

const MAPVN_TOKEN = import.meta.env.VITE_TRACKASIA_KEY;

export default function MapVietNam() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const currentMarkerRef = useRef(null);  // Marker vị trí hiện tại (xanh)
    const placeMarkerRef = useRef(null);    // Marker địa điểm đã chọn (đỏ)


    // Khởi tạo map
    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new trackasiagl.Map({
            container: mapContainer.current,
            style: `https://maps.track-asia.com/styles/v2/streets.json?key=${MAPVN_TOKEN}`,
            center: [106.695723, 10.786618],
            zoom: 11,
            accessToken: MAPVN_TOKEN,
        });

        mapRef.current.addControl(new trackasiagl.NavigationControl(), "top-right");

        return () => {
            try {
                mapRef.current?.remove();
            } catch (err) {
                console.warn("Error removing map:", err);
            }
            mapRef.current = null;
        };
    }, []);

    const isLocating = useRef(false);
    const goToCurrentLocation = () => {
        if (isLocating.current) return;
        isLocating.current = true;

        if (!navigator.geolocation) {
            toast.error("Trình duyệt không hỗ trợ định vị.");
            isLocating.current = false;
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                isLocating.current = false;
                const { latitude, longitude } = pos.coords;
                mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 14, speed: 1.2 });

                if (!currentMarkerRef.current) {
                    currentMarkerRef.current = new trackasiagl.Marker({ color: "blue" })
                        .setLngLat([longitude, latitude])
                        .addTo(mapRef.current);
                } else {
                    currentMarkerRef.current.setLngLat([longitude, latitude]);
                }

                //toast.success("Đã định vị vị trí hiện tại!");
            },
            (err) => {
                isLocating.current = false;
                //toast.error("Không lấy được vị trí: " + err.message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Tìm kiếm địa điểm
    const handleSearch = async () => {
        if (!query) return;
        try {
            const res = await searchLocation(query);
            const list = res.data?.results || [];
            if (list.length === 0) toast.info("Không tìm thấy kết quả nào.");
            setResults(list);
        } catch (e) {
            console.error(e);
            toast.error("Lỗi tìm kiếm.");
        }
    };

    const extractLatLng = (place) => {
        if (!place) return { lat: null, lng: null };
        if (place.geometry?.location) {
            const loc = place.geometry.location;
            return {
                lat: typeof loc.lat === "function" ? loc.lat() : loc.lat,
                lng: typeof loc.lng === "function" ? loc.lng() : loc.lng,
            };
        }
        return { lat: place.lat ?? place.latitude, lng: place.lon ?? place.longitude };
    };

    const handleSelect = (place) => {
        const { lat, lng } = extractLatLng(place);
        if (!lat || !lng) return;

        setSelectedPlace(place);
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 13 });

        if (!placeMarkerRef.current) {
            placeMarkerRef.current = new trackasiagl.Marker({ color: "red" })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);
        } else {
            placeMarkerRef.current.setLngLat([lng, lat]);
        }

        setQuery(place.formatted_address || place.name || "");
        setResults([]);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setSelectedPlace(null);

        if (placeMarkerRef.current) {
            placeMarkerRef.current.remove();
            placeMarkerRef.current = null;
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb items={[{ label: "Bản đồ", path: "/map" }]} />
            <h2 className="text-2xl font-bold">Bản đồ tìm kiếm địa điểm theo địa chỉ mới</h2>

            <div className="grid lg:grid-cols-6 gap-6 mt-2">
                {/* Sidebar */}
                <aside className="lg:col-span-2 bg-white shadow-lg rounded-lg p-4 h-[80vh] overflow-y-auto">
                    {/* Tabs */}
                    <div className="flex border-b mb-3">
                        <button className="flex-1 py-2 border-b-2 border-blue-500 font-bold">
                            Tìm kiếm
                        </button>
                    </div>
                    <div>
                        <div className="flex mb-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Tìm địa điểm..."
                                className="flex-1 px-3 py-2 border rounded-l-lg"
                            />

                            {query && (
                                <button
                                    onClick={clearSearch}
                                    className="px-2 text-gray-400 hover:text-black"
                                >
                                    ✕
                                </button>
                            )}

                            <button onClick={handleSearch} className="px-3 bg-gray-200 rounded-r-lg">
                                <Search size={18} />
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {results.map((place, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => handleSelect(place)}
                                    className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                                >
                                    <p className="font-medium">{place.name || "Không tên"}</p>
                                    <p className="text-sm text-gray-500">{place.formatted_address}</p>
                                    {place.old_formatted_address && (<i className="text-gray-400 block">Địa chỉ cũ: {place.old_formatted_address}</i>)}
                                </li>
                            ))}
                        </ul>

                        {selectedPlace && (
                            <div className="mt-4 p-3 border rounded bg-gray-50">
                                <h3 className="font-bold">{selectedPlace.name}</h3>
                                <p>{selectedPlace.formatted_address}</p>
                                {selectedPlace.old_formatted_address && (<i className="text-gray-400 block">Địa chỉ cũ: {selectedPlace.old_formatted_address}</i>)}
                                Tọa độ: <b>{selectedPlace.geometry.location.lat}, {selectedPlace.geometry.location.lng}</b>
                            </div>
                        )}
                    </div>

                </aside>

                {/* Map */}
                <div className="lg:col-span-4 relative w-full h-[80vh]">
                    <button
                        onClick={goToCurrentLocation}
                        className="absolute bottom-6 right-6 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100"
                    >
                        <Crosshair size={20} />
                    </button>
                    <div ref={mapContainer} className="w-full h-full rounded-lg shadow-md" />
                </div>
            </div >
        </div >
    );
}
