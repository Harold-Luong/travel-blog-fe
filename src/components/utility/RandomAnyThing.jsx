import { useState } from "react";
import { Card, CardContent } from "../common/Card";
import { RefreshCw, Shuffle, Dice1, Dice5 } from "lucide-react";

export default function RandomAnyThing() {
    const [mode, setMode] = useState("number"); // "number" | "text"
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [texts, setTexts] = useState("");
    const [result, setResult] = useState(null);
    const [shuffled, setShuffled] = useState([]);
    const [showIndex, setShowIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingShuff, setLoadingShuff] = useState(false);

    const randomNumber = () => {
        const minVal = min ? parseInt(min, 10) : 0;
        const maxVal = max ? parseInt(max, 10) : 100;
        return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    };

    const randomText = () => {
        const arr = texts.split(",").map(s => s.trim()).filter(Boolean);
        if (arr.length === 0) return "Nhập ít nhất 1 text";
        const idx = Math.floor(Math.random() * arr.length);
        return arr[idx];
    };

    const shuffleText = () => {
        const arr = texts.split(",").map(s => s.trim()).filter(Boolean);
        if (arr.length === 0) return [];
        return arr.sort(() => Math.random() - 0.5);
    };

    const handleRandom = () => {
        setLoading(true);
        setResult(null);
        setShuffled([]);
        setLoadingShuff(false)
        setTimeout(() => {
            setResult(mode === "number" ? randomNumber() : randomText());
            setLoading(false);
        }, 1200);
    };

    const handleShuffle = () => {
        const arr = shuffleText();
        setLoadingShuff(true);
        setResult(null);
        setShuffled([]);
        setShowIndex(0);

        setTimeout(() => {
            setLoadingShuff(false);
            setShuffled(arr);
            setShowIndex(1);

            let i = 1;
            const interval = setInterval(() => {
                i++;
                setShowIndex(i);
                if (i >= arr.length) clearInterval(interval);
            }, 700);
        }, 1000);
    };

    return (
        <Card className="p-4">
            <CardContent className="space-y-4">
                <div className="text-lg font-semibold tracking-wide border-b border-vintageBrown pb-1">
                    🎲 Random Anything
                </div>

                {/* Chọn chế độ */}
                <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input
                            type="radio"
                            value="number"
                            checked={mode === "number"}
                            onChange={() => { setMode("number"); setResult(null); setShuffled([]) }}
                            className="accent-vintageBrown"
                        />
                        Number
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input
                            type="radio"
                            value="text"
                            checked={mode === "text"}
                            onChange={() => { setMode("text"); setResult(null); }}
                            className="accent-vintageBrown"
                        />
                        Text
                    </label>
                </div>

                {/* Input cho Number */}
                {mode === "number" && (
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            className="border border-vintageBrown/40 p-2 rounded-lg w-24 focus:ring-2 focus:ring-vintageBrown"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            className="border border-vintageBrown/40 p-2 rounded-lg w-24 focus:ring-2 focus:ring-vintageBrown"
                        />
                    </div>
                )}

                {/* Input cho Text */}
                {mode === "text" && (
                    <textarea
                        placeholder="Nhập các text, cách nhau bằng dấu phẩy"
                        value={texts}
                        onChange={(e) => setTexts(e.target.value)}
                        className="border border-vintageBrown/40 p-3 rounded-lg w-full focus:ring-2 focus:ring-vintageBrown"
                        rows={3}
                    />
                )}

                {/* Nút Random + Shuffle */}
                <div className="flex gap-4">
                    <button
                        onClick={handleRandom}
                        className="flex items-center gap-2 px-4 py-2 bg-vintageBrown text-vintageCream rounded-xl shadow hover:scale-105 transition"
                    >
                        <RefreshCw
                            size={18}
                            className={`${loading ? "animate-spin" : ""}`}
                        /> Random
                    </button>
                    {mode === "text" && (
                        <button
                            onClick={handleShuffle}
                            className="flex items-center gap-2 px-4 py-2 bg-vintageGreen text-white rounded-xl shadow hover:scale-105 transition"
                        >
                            <Shuffle size={18}
                                className={`${loadingShuff ? "animate-ping" : ""}`}
                            /> Shuffle
                        </button>
                    )}
                </div>

                {/* Kết quả */}
                <div className="mt-6 min-h-[40px] flex flex-col items-center font-serif">
                    {(loading || loadingShuff) && (
                        <div className="text-lg font-bold text-vintageBrown animate-pulse">
                            Đang bốc thăm...
                        </div>
                    )}

                    {result && !loading && (
                        <div className="text-3xl font-bold text-vintageBrown animate-bounce">
                            {result}
                        </div>
                    )}

                    {shuffled.length > 0 && !loadingShuff && (
                        <div className="space-y-2">
                            {shuffled.slice(0, showIndex).map((item, idx) => (
                                <div
                                    key={idx}
                                    className="text-xl font-medium animate-fade-in bg-vintageCream px-3 py-1 rounded-md shadow-sm" >
                                    {idx + 1}. {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
