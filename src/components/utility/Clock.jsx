import { useEffect, useState } from "react";
import { Card, CardContent } from "../common/Card";
import { solarDateToLunar, formatLunar, isVegetarianDayByLunar } from "../../api/lunar";

const LOCALE = "vi-VN";
const TIMEZONE = "Asia/Ho_Chi_Minh";

export default function Clock() {
    const [current, setCurrent] = useState(new Date());

    const solarDate = new Date();
    const lunaDate = solarDateToLunar(solarDate);
    const isVegetarianDay = isVegetarianDayByLunar(solarDate);

    useEffect(() => {
        const t = setInterval(() => setCurrent(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <Card className="p-4 col-span-1 shadow-md rounded-2xl bg-white">
            <CardContent className="flex flex-col items-center text-center space-y-2">
                {/* Title */}
                <div className="text-xs text-gray-500">
                    Giờ hiện tại ({TIMEZONE})
                </div>

                {/* Time */}
                <div className="text-3xl font-bold text-gray-900 tracking-widest">
                    {current.toLocaleTimeString(LOCALE)}
                </div>

                {/* Solar date */}
                <div className="text-sm text-gray-600">
                    {current.toLocaleDateString(LOCALE, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })}
                </div>

                {/* Lunar date */}
                <div className="text-[11px] text-gray-400 italic">
                    {formatLunar(lunaDate)}
                </div>

                {/* Vegetarian day */}
                {isVegetarianDay && (
                    <div className="px-2 py-1 mt-2 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        🌱 Ngày ăn chay
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
