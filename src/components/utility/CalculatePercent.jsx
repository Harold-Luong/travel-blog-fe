
import { ArrowDownUpIcon } from "lucide-react";
import { Card, CardContent } from "../common/Card";
import { useState } from "react";

export default function CalculatePercent() {
    const calculatePercent = (x, y) => {
        if (x === 0) return 0;
        const result = ((y - x) / x) * 100;

        if (result > 0) setStatus("Tăng");
        else if (result < 0) setStatus("Giảm");
        else setStatus("Không đổi");
        return Math.abs(result).toFixed(2) + "%";
    }

    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [percaent, setPercaent] = useState(null);
    const [status, setStatus] = useState("");
    const calculate = () => {
        if (!x || !y) return;
        const result = calculatePercent(parseFloat(x), parseFloat(y));
        setPercaent(result);
    }

    return (
        <Card className="p-4">
            <CardContent className="space-y-4">
                <div className="text-lg font-semibold tracking-wide border-b border-vintageBrown pb-1">
                    Tính phần trăm
                </div>

                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Giá trị ban đầu (X)"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        className="w-full border rounded px-3 py-2" />
                    <div className="text-center">
                        <button onClick={() => { const temp = x; setX(y); setY(temp); }} className="text-vintageBrown font-bold hover:underline">
                            <ArrowDownUpIcon size={16} />
                        </button>
                    </div>
                    <div className="space-y-2"></div>

                    <input
                        type="number"
                        placeholder="Giá trị mới (Y)"
                        value={y}
                        onChange={(e) => setY(e.target.value)}
                        className="w-full border rounded px-3 py-2" />
                </div>

                <button
                    onClick={calculate}
                    className="w-full bg-vintageBrown text-white py-2 rounded-lg shadow hover:opacity-90">
                    Tính phần trăm
                </button>

                {percaent && (
                    <div className="text-center mt-4">
                        <p className="text-lg font-medium">
                            {status === "Tăng" && "📈 Tăng"}
                            {status === "Giảm" && "📉 Giảm"}
                            {status === "Không đổi" && "➖ Không đổi"}
                            {/* chữ đỏ nếu giảm, chữ xanh nếu tăng */}
                            <span
                                className={`ml-2 font-bold ${status === "Giảm" ? "text-red-500" : status === "Tăng" ? "text-green-500" : ""}`}>
                                {percaent}
                            </span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
