import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import ReactDOM from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { fetchTrips, fetchTripDetailsById } from "../../api/trip"; // Assuming you have a fetchTrips function in api/trip.js
import TripSelected from "./TripSelected";
import MarkerDetails from "./MarkerDetails";
import { Card, CardContent } from "../common/Card";
import Breadcrumb from "../common/Breadcrumb";

export default function Map() {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const popupRef = useRef(null);
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null) // mặt định trip 1
    const [locationByTrip, setLocationByTrip] = useState([]); // dữ liệu gốc 
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    // ================== Helpers ==================
    const coordinatesGeocoder = (query) => {
        const matches = query.match(
            /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
        );
        if (!matches) return null;

        const coordinateFeature = (lng, lat) => ({
            center: [lng, lat],
            geometry: { type: "Point", coordinates: [lng, lat] },
            place_name: `Lat: ${lat} Lng: ${lng}`,
            place_type: ["coordinate"],
            properties: {},
            type: "Feature",
        });

        const coord1 = Number(matches[1]);
        const coord2 = Number(matches[2]);
        const geocodes = [];

        if (coord1 < -90 || coord1 > 90) geocodes.push(coordinateFeature(coord1, coord2));
        if (coord2 < -90 || coord2 > 90) geocodes.push(coordinateFeature(coord2, coord1));
        if (geocodes.length === 0) {
            geocodes.push(coordinateFeature(coord1, coord2));
            geocodes.push(coordinateFeature(coord2, coord1));
        }
        return geocodes;
    };

    const addGeocoder = () => {
        const geocoder = new MapboxGeocoder({
            accessToken: MAPBOX_TOKEN,
            mapboxgl,
            marker: false,
            localGeocoder: coordinatesGeocoder,
            placeholder: "Tìm địa điểm hoặc nhập lat,lng (VD: 21.03, 105.85)",
        });

        mapRef.current.addControl(geocoder);

        geocoder.on("result", (e) => {
            const { center } = e.result;
            if (markerRef.current) {
                markerRef.current.setLngLat(center);
            } else {
                markerRef.current = new mapboxgl.Marker({ color: "red" })
                    .setLngLat(center)
                    .addTo(mapRef.current);
            }
            mapRef.current.flyTo({ center, zoom: 12 });
        });
    };

    const addClickHandler = () => {
        mapRef.current.on("click", async (e) => {
            const { lng, lat } = e.lngLat;

            // Move or create marker
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new mapboxgl.Marker({ color: "red" })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);
            }

            // Reverse geocoding
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=vi`;
            const res = await fetch(url);
            const data = await res.json();
            const placeName = data?.features?.[0]?.place_name || "Không tìm thấy địa chỉ";

            if (popupRef.current) {
                popupRef.current.setLngLat([lng, lat]).setHTML(`<b>${placeName}</b>`).addTo(mapRef.current);
            } else {
                popupRef.current = new mapboxgl.Popup()
                    .setLngLat([lng, lat])
                    .setHTML(`<b>${placeName}</b>`)
                    .addTo(mapRef.current);
            }
        });
    };

    const addMarkersFromLocations = () => {
        locationByTrip.forEach((loc) => {
            if (!loc.longitude || !loc.latitude) return;

            // Tạo DOM node cho React render
            const popupNode = document.createElement("div");

            // Render React component vào DOM node
            ReactDOM.createRoot(popupNode).render(<MarkerDetails loc={loc} />);

            const popup = new mapboxgl.Popup({ offset: 25, maxWidth: "400px" }).setDOMContent(popupNode);

            new mapboxgl.Marker({ color: "red" })
                .setLngLat([loc.longitude, loc.latitude])
                .setPopup(popup)
                .addTo(mapRef.current);
        });

        if (locationByTrip.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            locationByTrip.forEach((loc) => {
                if (loc.longitude && loc.latitude) bounds.extend([loc.longitude, loc.latitude]);
            });
            mapRef.current.fitBounds(bounds, { padding: 140 });
        }
    };

    // ================== Init Map ==================
    useEffect(() => {
        if (!mapContainerRef.current) return;
        mapboxgl.accessToken = MAPBOX_TOKEN;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [106.7, 10.77], // Default center
            zoom: 8,
        });

        addGeocoder();
        addClickHandler();
        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        addMarkersFromLocations();

        return () => mapRef.current?.remove();
    }, [MAPBOX_TOKEN, locationByTrip]);

    // fetch trips 
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all trips with userID 1
                const response = await fetchTrips(1, 0, 999);
                if (Array.isArray(response.data)) {
                    setTrips(response.data);
                } else {
                    setTrips(response.data || []);
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (selectedTripId) {
                    const response = await fetchTripDetailsById(selectedTripId);
                    if (Array.isArray(response.data.locations)) {
                        setLocationByTrip(response.data.locations);
                    } else {
                        setLocationByTrip(response.data.locations || []);
                    }
                }

            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };
        fetchDetails();
    }, [selectedTripId]);

    const handleSeclectedTrip = (e) => {
        setSelectedTripId(e.id)
    }

    // Hàm move + zoom đến vị trí
    const moveToLocation = (lat, lng, zoom = 15) => {
        if (!mapRef.current) return;

        mapRef.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            speed: 1.2,
            curve: 1.4,
        });
    };

    return (
        <div className="space-y-6">
            <Breadcrumb />
            <h2 className="text-2xl font-bold">Map travel</h2>
            <div className="px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
                    {/* TripSelected chiếm 1 cột */}
                    <div className="lg:col-span-1 h-screen w-full overflow-y-auto pr-2">
                        <TripSelected tripList={trips} onSelected={(e) => handleSeclectedTrip(e)} />
                        {locationByTrip.map((loc, idx) => (
                            <div key={loc.id || idx} className="pb-2">
                                <Card className="cursor-pointer" onClick={() => moveToLocation(loc.latitude, loc.longitude)}>
                                    <CardContent>
                                        <span className="font-semibold">{loc.name}</span>
                                        <p>{loc.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* Map chiếm 3 cột */}
                    <div className="lg:col-span-3">
                        <div ref={mapContainerRef} className="h-screen w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}