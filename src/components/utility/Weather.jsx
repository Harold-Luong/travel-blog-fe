import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "../common/Card";
import {
    Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, Snowflake, Wind,
    Droplets, Gauge, Sunrise, Sunset, RotateCw
} from "lucide-react";

export default function Weather() {
    const key = import.meta.env.VITE_OPENWEATHER_KEY;
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const defaultCoords = { lat: 10.8231, lon: 106.6297 }; // HCM fallback

    const formatTimeAtLocation = (ts, offsetSec) =>
        new Date((ts + offsetSec) * 1000).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
        });

    const getWeatherIcon = (main) => {
        switch (main) {
            case "Clear": return <Sun size={64} className="text-yellow-500" />;
            case "Clouds": return <Cloud size={64} className="text-gray-500" />;
            case "Rain": return <CloudRain size={64} className="text-blue-500" />;
            case "Thunderstorm": return <CloudLightning size={64} className="text-yellow-600" />;
            case "Drizzle": return <CloudDrizzle size={64} className="text-blue-400" />;
            case "Snow": return <Snowflake size={64} className="text-cyan-400" />;
            case "Mist":
            case "Fog":
            case "Haze": return <Wind size={64} className="text-gray-400" />;
            default: return <Sun size={64} />;
        }
    };

    const loadWeather = useCallback(async (coords) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${key}&units=metric&lang=vi`
            );
            const data = await res.json();
            if (data.cod !== 200) throw new Error(data.message);
            setWeather(data);
        } catch (e) {
            setError("Không thể tải dữ liệu thời tiết");
            setWeather(null);
        } finally {
            setLoading(false);
        }
    }, [key]);

    const fetchWeather = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => loadWeather(defaultCoords)
            );
        } else {
            loadWeather(defaultCoords);
        }
    }, [loadWeather]);

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, 3600000); // refresh mỗi 1h
        return () => clearInterval(interval);
    }, [fetchWeather]);

    return (
        <Card className="p-4 col-span-2 relative bg-vintageCream rounded-xl shadow-md">
            <CardContent className="p-4">
                {/* Nút refresh */}
                <button
                    onClick={fetchWeather}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition"
                    title="Làm mới thủ công"
                    disabled={loading}
                >
                    <RotateCw className={`w-5 h-5 ${loading ? "animate-spin text-gray-400" : ""}`} />
                </button>

                {error && <div className="text-red-500 mb-2">{error}</div>}

                {weather && (
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        {/* Bên trái: Nhiệt độ & trạng thái */}
                        <div>
                            <div className="text-sm text-gray-500">
                                Thời tiết ({weather.name}, {weather.sys?.country})
                                <p>Cập nhật lúc: {formatTimeAtLocation(weather.dt, weather.timezone)}</p>
                            </div>
                            <div className={`mt-2 text-4xl font-bold ${loading ? "animate-pulse" : ""}`}>
                                {Math.round(weather.main?.temp)}°C
                            </div>
                            <div className="text-sm text-gray-600">
                                Cảm giác như {Math.round(weather.main?.feels_like)}°C
                            </div>
                            <div className="mt-1 text-sm capitalize text-gray-500">
                                {weather.weather?.[0]?.description}
                            </div>
                        </div>

                        {/* Bên phải: Icon + chi tiết */}
                        <div className="flex flex-col items-center mt-4 md:mt-0">
                            {getWeatherIcon(weather.weather?.[0]?.main)}

                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 mt-3">
                                <div className="flex items-center gap-1"><Droplets size={14} /> Độ ẩm</div>
                                <div>{weather.main?.humidity}%</div>

                                <div className="flex items-center gap-1"><Wind size={14} /> Gió</div>
                                <div>{weather.wind?.speed} m/s</div>

                                <div className="flex items-center gap-1"><Gauge size={14} /> Áp suất</div>
                                <div>{weather.main?.pressure} hPa</div>

                                <div className="flex items-center gap-1"><Cloud size={14} /> Mây</div>
                                <div>{weather.clouds?.all}%</div>
                            </div>

                            <div className="flex justify-between gap-6 text-sm text-gray-600 mt-3">
                                <div className="flex items-center gap-1">
                                    <Sunrise size={14} /> {formatTimeAtLocation(weather.sys?.sunrise, weather.timezone)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Sunset size={14} /> {formatTimeAtLocation(weather.sys?.sunset, weather.timezone)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-sm text-gray-500 mt-2">
                    {loading && "Đang tải dữ liệu..."}
                </div>
            </CardContent>
        </Card>
    );
}
