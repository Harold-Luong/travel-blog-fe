import React, { useState, useMemo } from 'react'
import { Card, CardContent } from '../common/Card'
import { solarDateToLunar, isVegetarianDayByLunar } from '../../api/lunar'

const LOCALE = "vi-VN";
const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function Calendar() {
    const current = new Date();
    const [viewYear, setViewYear] = useState(current.getFullYear());
    const [viewMonth, setViewMonth] = useState(current.getMonth());

    // Tạo ma trận tuần để hiển thị lịch
    const weeks = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay = new Date(viewYear, viewMonth + 1, 0);
        const days = [];
        let week = new Array(firstDay.getDay()).fill(null);

        for (let d = 1; d <= lastDay.getDate(); d++) {
            week.push(new Date(viewYear, viewMonth, d));
            if (week.length === 7) {
                days.push(week);
                week = [];
            }
        }
        if (week.length > 0) {
            while (week.length < 7) week.push(null);
            days.push(week);
        }
        return days;
    }, [viewYear, viewMonth]);

    const isFasting = (date) => {
        return isVegetarianDayByLunar(date);
    };

    return (
        <Card className="p-4">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm text-gray-500">Lịch</div>
                        <div className="font-semibold">
                            {new Date(viewYear, viewMonth).toLocaleString(LOCALE, { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 rounded bg-gray-100"
                            onClick={() => { const m = viewMonth - 1; setViewMonth((m + 12) % 12); setViewYear(y => m < 0 ? y - 1 : y); }}>Prev</button>
                        <button className="px-2 py-1 rounded bg-gray-100"
                            onClick={() => { const m = viewMonth + 1; setViewMonth(m % 12); setViewYear(y => m > 11 ? y + 1 : y); }}>Next</button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-2">
                    {weekDays.map((w) => <div key={w} className="py-1">{w}</div>)}
                </div>

                <div>
                    {weeks.map((week, i) => (
                        <div key={i} className="grid grid-cols-7 gap-1 mb-1">
                            {week.map((d, j) => (
                                <div key={j} className={`text-center p-2 rounded cursor-pointer ${d ? 'bg-white' : 'bg-transparent'}`}>
                                    {d ? (
                                        <div className="relative">
                                            <div className={`w-full h-10 flex flex-col items-center justify-center ${isFasting(d) ? 'bg-yellow-100 rounded-md border border-yellow-300' : ''}`}>
                                                <div className={`text-sm ${d.toDateString() === current.toDateString() ? 'font-semibold text-red-800' : 'text-gray-800'}`}>{d.getDate()}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">{solarDateToLunar(d).lunarDay == 1 ? solarDateToLunar(d).lunarDay + "/" + solarDateToLunar(d).lunarMonth : solarDateToLunar(d).lunarDay}</div>
                                            </div>
                                            {isFasting(d) && (
                                                <div className="absolute top-1 right-1 text-xs text-yellow-700"></div>
                                                // <div className="text-[10px] text-yellow-700">✦</div>
                                            )}
                                        </div>
                                    ) : <div className="h-10"></div>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
