// utility/BMICalculator.jsx
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
        <Card className="p-4">
            <CardContent className="space-y-4">
                <div className="text-lg font-semibold tracking-wide border-b border-vintageBrown pb-1">
                    Tính chỉ số BMI
                </div>
                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Cân nặng (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full border rounded px-3 py-2" />
                    <input
                        type="number"
                        placeholder="Chiều cao (cm)"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full border rounded px-3 py-2" />
                </div>

                <button
                    onClick={calculateBMI}
                    className="w-full bg-vintageBrown text-white py-2 rounded-lg shadow hover:opacity-90">
                    Tính BMI
                </button>

                {bmi && (
                    <div className="text-center mt-4">
                        <p className="text-lg font-medium">
                            Chỉ số BMI: <span className="font-bold">{bmi}</span>
                        </p>
                        <p className="text-sm text-gray-600">{status}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
