import { Crosshair } from 'lucide-react'
import React, { useEffect, useRef } from "react";
import "trackasia-gl/dist/trackasia-gl.css";
import * as trackasiagl from "trackasia-gl";
import { toast } from "react-toastify";

const MAPVN_TOKEN = import.meta.env.VITE_TRACKASIA_KEY;

export default function MapCommon({ days = [], colors = [] }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const isLocating = useRef(false);
    const currentMarkerRef = useRef(null);  // Marker vị trí hiện tại (xanh)

    // Khởi tạo map
    React.useEffect(() => {
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
                mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 12, speed: 1.3 });

                if (!currentMarkerRef.current) {
                    currentMarkerRef.current = new trackasiagl.Marker({ color: "blue" })
                        .setLngLat([longitude, latitude])
                        .addTo(mapRef.current);
                } else {
                    currentMarkerRef.current.setLngLat([longitude, latitude]);
                }

                toast.success("Đã định vị vị trí hiện tại!");
            },
            (err) => {
                isLocating.current = false;
                toast.error("Không lấy được vị trí: " + err.message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        if (!mapRef.current) return;

        // Xóa marker cũ
        if (mapRef.current.markers) {
            mapRef.current.markers.forEach((marker) => marker.remove());
        }
        mapRef.current.markers = [];

        const bounds = new trackasiagl.LngLatBounds();
        if (days.length <= 0) return;

        days.forEach((day, dayIndex) => {
            const color = colors[dayIndex] || "red";
            (day?.activities || []).forEach((activity) => {
                const loc = activity?.location;
                if (!loc || loc.longitude == null || loc.latitude == null) {
                    console.warn("Skipping invalid location:", activity);
                    return;
                }

                const popup = new trackasiagl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    offset: 25,
                }).setText(loc.name || "Địa điểm không tên");

                const marker = new trackasiagl.Marker({ color })
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


                mapRef.current.markers.push(marker);
                bounds.extend([loc.longitude, loc.latitude]);

            });

        });

        if (mapRef.current && !bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds, { padding: 100, maxZoom: 12 });
        }

    }, [days]);

    return (
        <div className="lg:col-span-4 relative w-full h-full">
            <button
                onClick={goToCurrentLocation}
                className="absolute bottom-6 right-6 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100"
            >
                <Crosshair size={20} />
            </button>
            <div ref={mapContainer} className="w-full h-full rounded-lg shadow-md" />
        </div>
    )
}



