import { useEffect, useRef, useState } from "react";
import { fetchTrips, fetchTripDetailsById } from "../../api/trip";
import TripSelected from "./TripSelected";
import MarkerDetails from "./MarkerDetails";
import { Card, CardContent } from "../common/Card";
import Breadcrumb from "../common/Breadcrumb";
import "trackasia-gl/dist/trackasia-gl.css";
import trackasiagl from "trackasia-gl";
import ReactDOM from "react-dom/client";

export default function MapVietNam() {
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [locationByTrip, setLocationByTrip] = useState([]);
    const [centerLocation, setCenterLocation] = useState({ longitude: 106.694945, latitude: 10.769034 });
    // lưu markers hiện tại
    const markersRef = useRef([]);
    const mapContainer = useRef(null); // DOM node
    const mapRef = useRef(null); // trackasiagl.Map instance
    const MAPVN_TOKEN = import.meta.env.VITE_TRACKASIA_KEY;

    useEffect(() => {
        if (!mapContainer.current) return;

        mapRef.current = new trackasiagl.Map({
            container: mapContainer.current,
            style: `https://maps.track-asia.com/styles/v2/streets.json?key=${MAPVN_TOKEN}`,
            center: [centerLocation.longitude, centerLocation.latitude], // [lng, lat]
            zoom: 9,
        });
        mapRef.current.addControl(new trackasiagl.NavigationControl({
            visualizePitch: true,
            visualizeRoll: true,
            showZoom: true,
            showCompass: true
        }));

        mapRef.current.on("load", () => {
            const popup = new trackasiagl.Popup({ offset: 25 }).setText(
                "Xin chào! Đây là TP.HCM 🇻🇳"
            );

            new trackasiagl.Marker({ color: "red" })
                .setLngLat([106.694945, 10.769034])
                .setPopup(popup)
                .addTo(mapRef.current);
        });

        return () => mapRef.current?.remove();
    }, [MAPVN_TOKEN]);

    // Fetch trips + fetch details chung 1 effect
    useEffect(() => {
        const fetchData = async () => {
            try {
                // luôn fetch trips lần đầu
                if (trips.length === 0) {
                    const response = await fetchTrips(1, 0, 999);
                    setTrips(Array.isArray(response.data) ? response.data : response.data || []);
                }

                // fetch details khi có trip được chọn
                if (selectedTripId) {
                    const response = await fetchTripDetailsById(selectedTripId);
                    const locations = response.data?.locations || [];
                    setLocationByTrip(Array.isArray(locations) ? locations : []);
                }
            } catch (error) {
                console.error("Error fetching trips/details:", error);
            }
        };

        fetchData();
    }, [selectedTripId]);

    // render markers mỗi khi locationByTrip thay đổi

    useEffect(() => {
        if (!mapRef.current) return;

        // xoá markers cũ
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // render markers mới
        locationByTrip.forEach((loc) => {
            if (!loc.longitude || !loc.latitude) return;

            const popupNode = document.createElement("div");
            ReactDOM.createRoot(popupNode).render(<MarkerDetails loc={loc} />);

            const popup = new trackasiagl.Popup({
                offset: 25,
                maxWidth: "400px",
                closeButton: false,
                closeOnClick: false,
            }).setDOMContent(popupNode);

            const marker = new trackasiagl.Marker({ color: "red" })
                .setLngLat([loc.longitude, loc.latitude])
                .addTo(mapRef.current);

            const markerEl = marker.getElement();
            markerEl.addEventListener("mouseenter", () => {
                popup.addTo(mapRef.current);
                popup.setLngLat([loc.longitude, loc.latitude]);
            });
            markerEl.addEventListener("mouseleave", () => {
                popup.remove();
            });

            markersRef.current.push(marker);
        });

        // fit bounds
        if (locationByTrip.length > 0) {
            const bounds = new trackasiagl.LngLatBounds();
            locationByTrip.forEach((loc) => {
                if (loc.longitude && loc.latitude) {
                    bounds.extend([loc.longitude, loc.latitude]);
                }
            });
            mapRef.current.fitBounds(bounds, { padding: 140 });
        }
    }, [locationByTrip]);

    const moveToLocation = (lat, lng, zoom = 15) => {
        if (!mapRef.current) return;
        mapRef.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            speed: 1.2,
            curve: 1.4,
        });
    };

    const handleSeclectedTrip = (e) => {
        setSelectedTripId(e.id);
    };

    return (
        <div className="space-y-6">
            <Breadcrumb />
            <h2 className="text-2xl font-bold">Map travel</h2>
            <div className="px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
                    {/* TripSelected chiếm 1 cột */}
                    <div className="lg:col-span-1 h-screen w-full overflow-y-auto pr-2">
                        <TripSelected tripList={trips} onSelected={handleSeclectedTrip} />
                        {locationByTrip.map((loc, idx) => (
                            <div key={loc.id || idx} className="pb-2">
                                <Card
                                    className="cursor-pointer"
                                    onClick={() => moveToLocation(loc.latitude, loc.longitude)} >
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
                            
                        <div id="map" ref={mapContainer} className="h-screen w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
