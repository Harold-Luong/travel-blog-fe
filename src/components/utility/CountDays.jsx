import { useState } from "react";
import { Card, CardContent } from "../common/Card";

export default function CountDays() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [days, setDays] = useState(null);
    const [nights, setNights] = useState(null);
    const [error, setError] = useState("");

    const calculate = () => {
        setError("");
        setDays(null);
        setNights(null);

        if (!startDate || !endDate) {
            setError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
            return;
        }

        const s = new Date(startDate);
        const e = new Date(endDate);

        if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
            setError("Định dạng ngày không hợp lệ.");
            return;
        }

        // Normalize time to midnight to avoid timezone issues
        s.setHours(0, 0, 0, 0);
        e.setHours(0, 0, 0, 0);

        const diffMs = e - s;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            setError("Ngày kết thúc phải không sớm hơn ngày bắt đầu.");
            return;
        }

        // Convention: number of days = inclusive days (e.g., 1 ngày nếu start==end)
        // If you prefer exclusive, adjust accordingly.
        const inclusiveDays = diffDays + 1;

        setDays(inclusiveDays);

        // Nights are usually days - 1, minimum 0
        setNights(Math.max(0, inclusiveDays - 1));
    };

    const clear = () => {
        setStartDate("");
        setEndDate("");
        setDays(null);
        setNights(null);
        setError("");
    };

    return (
        <Card>
            <CardContent>
                <div className="mb-3 border-b border-vintageBrown pb-1">
                    <h3 className="text-base font-semibold">Đếm số ngày</h3>
                    <p className="text-xs text-gray-500">Tính số ngày và số đêm giữa hai mốc thời gian</p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600">Ngày bắt đầu</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintageBrown"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Ngày kết thúc</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintageBrown"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={calculate}
                            className="flex-1 bg-vintageBrown text-white py-2 rounded-lg shadow hover:opacity-90"
                        >
                            Tính
                        </button>
                        <button
                            onClick={clear}
                            className="flex items-center justify-center gap-1 px-4 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
                        >
                            Clear
                        </button>
                    </div>

                    {error && <div className="text-sm text-red-500">{error}</div>}

                    {days !== null && (
                        <div className="mt-3 p-3 bg-gray-50 border rounded-lg">
                            <div className="text-center">
                                <div className="text-lg font-semibold">
                                    Số ngày: <span className="text-vintageBrown">{days}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Số đêm: <span className="font-medium">{nights}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
