import { ArrowDownUpIcon, XCircle } from "lucide-react";
import { Card, CardContent } from "../common/Card";
import { useState } from "react";

export default function CalculatePercent() {
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [percent, setPercent] = useState(null);
    const [status, setStatus] = useState("");
    const [ratio, setRatio] = useState(null);

    const calculatePercent = (x, y) => {
        if (x === 0) return 0;
        const result = ((y - x) / x) * 100;

        if (result > 0) setStatus("Tăng");
        else if (result < 0) setStatus("Giảm");
        else setStatus("Không đổi");

        return Math.abs(result).toFixed(2) + "%";
    };

    const calculate = () => {
        if (!x || !y) return;
        const result = calculatePercent(parseFloat(x), parseFloat(y));
        setPercent(result);

        // tính thêm Y chiếm % bao nhiêu so với X
        if (parseFloat(x) !== 0) {
            const r = (parseFloat(y) / parseFloat(x)) * 100;
            setRatio(r.toFixed(2) + "%");
        }
    };

    const handleSwap = () => {
        const temp = x;
        setX(y);
        setY(temp);
        setPercent(null);
        setRatio(null);
    };

    const handleClear = () => {
        setX("");
        setY("");
        setPercent(null);
        setStatus("");
        setRatio(null);
    };

    return (
        <Card className="p-4">
            <CardContent className="space-y-5">
                <div className="text-lg font-semibold tracking-wide border-b border-vintageBrown pb-1">
                    Tính phần trăm
                </div>

                {/* Input */}
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Giá trị ban đầu (X)"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-vintageBrown"
                    />

                    {/* Swap button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleSwap}
                            className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition"
                        >
                            <ArrowDownUpIcon size={18} className="text-vintageBrown" />
                        </button>
                    </div>

                    <input
                        type="number"
                        placeholder="Giá trị mới (Y)"
                        value={y}
                        onChange={(e) => setY(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-vintageBrown"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={calculate}
                        className="flex-1 bg-vintageBrown text-white py-2 rounded-lg shadow hover:bg-vintageBrown/90"
                    >
                        Tính phần trăm
                    </button>
                    <button
                        onClick={handleClear}
                        className="flex items-center justify-center gap-1 px-4 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
                    >
                        <XCircle size={18} /> Clear
                    </button>
                </div>

                {/* Kết quả */}
                {percent && (
                    <div className="text-center mt-3 space-y-2">
                        <p className="text-lg font-medium">
                            {status === "Tăng" && "📈 Tăng"}
                            {status === "Giảm" && "📉 Giảm"}
                            {status === "Không đổi" && "➖ Không đổi"}
                            <span
                                className={`ml-2 font-bold ${status === "Giảm"
                                    ? "text-red-500"
                                    : status === "Tăng"
                                        ? "text-green-500"
                                        : "text-gray-600"
                                    }`}
                            >
                                {percent}
                            </span>
                        </p>

                        {ratio && (
                            <p className="text-sm text-gray-600">
                                Y chiếm <span className="font-semibold text-vintageBrown">{ratio}</span> của X
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
