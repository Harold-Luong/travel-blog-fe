import { useState } from "react";
import { Card, CardContent } from "../common/Card";

export default function BMICalculator() {
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState("");

    const calculateBMI = () => {
        if (!weight || !height) return;

        const h = parseFloat(height) / 100; // cm -> m
        const w = parseFloat(weight);
        const result = w / (h * h);

        setBmi(result.toFixed(1));

        if (result < 18.5) setStatus("Gầy");
        else if (result < 24.9) setStatus("Bình thường");
        else if (result < 29.9) setStatus("Thừa cân");
        else setStatus("Béo phì");
    };

    return (
        <Card>
            <CardContent>
                {/* Tiêu đề */}
                <div className="pb-3 border-b border-vintageBrown mb-4">
                    <h2 className="text-base font-semibold text-gray-800">
                        Tính chỉ số BMI
                    </h2>
                    <p className="text-xs text-gray-500">
                        (Body Mass Index)
                    </p>
                </div>

                {/* Form nhập liệu */}
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Cân nặng (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintageBrown focus:border-vintageBrown transition"
                    />
                    <input
                        type="number"
                        placeholder="Chiều cao (cm)"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintageBrown focus:border-vintageBrown transition"
                    />
                </div>

                {/* Nút tính toán */}
                <button
                    onClick={calculateBMI}
                    className="mt-4 w-full bg-vintageBrown text-white py-2 rounded-lg font-medium shadow-md hover:opacity-90 transition"
                >
                    Tính BMI
                </button>

                {/* Kết quả */}
                {bmi && (
                    <div className="text-center mt-5 p-3 bg-gray-50 rounded-lg border">
                        <p className="text-lg font-semibold text-gray-800">
                            Chỉ số BMI:{" "}
                            <span className="text-vintageBrown">{bmi}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{status}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
