import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "../common/Card";
import { RefreshCw, Shuffle, XCircle } from "lucide-react";

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

    // refs cho timer
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);

    // --- helpers ---
    const randomNumber = () => {
        const minVal = min ? parseInt(min, 10) : 0;
        const maxVal = max ? parseInt(max, 10) : 100;
        return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    };

    const randomText = () => {
        const arr = texts.split(",").map(s => s.trim()).filter(Boolean);
        if (arr.length === 0) return "Hãy nhập ít nhất 1 giá trị";
        const idx = Math.floor(Math.random() * arr.length);
        return arr[idx];
    };

    const shuffleText = () =>
        texts.split(",").map(s => s.trim()).filter(Boolean)
            .sort(() => Math.random() - 0.5);

    const clearTimers = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // --- actions ---
    const handleClear = () => {
        clearTimers();
        setResult(null);
        setShuffled([]);
        setShowIndex(0);
        setLoading(false);
        setLoadingShuff(false);
    };

    const handleRandom = () => {
        handleClear();
        setLoading(true);

        timeoutRef.current = setTimeout(() => {
            setResult(mode === "number" ? randomNumber() : randomText());
            setLoading(false);
        }, 1000);
    };

    const handleShuffle = () => {
        handleClear();
        const arr = shuffleText();
        if (arr.length === 0) return;

        setLoadingShuff(true);
        setShowIndex(0);

        timeoutRef.current = setTimeout(() => {
            setLoadingShuff(false);
            setShuffled(arr);
            setShowIndex(1);

            let i = 1;
            intervalRef.current = setInterval(() => {
                i++;
                setShowIndex(i);
                if (i >= arr.length) clearInterval(intervalRef.current);
            }, 600);
        }, 800);
    };

    // cleanup khi component unmount
    useEffect(() => {
        return () => clearTimers();
    }, []);

    // --- render ---
    return (
        <Card>
            <CardContent className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="text-sm text-gray-500">Công cụ tạo ngẫu nhiên</div>
                    <div className="text-lg font-bold text-vintageBrown">Random Anything</div>
                </div>

                {/* Mode chọn */}
                <div className="flex justify-center gap-6 text-sm">
                    {["number", "text"].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value={opt}
                                checked={mode === opt}
                                onChange={() => { setMode(opt); handleClear(); }}
                                className="accent-vintageBrown"
                            />
                            <span className="font-medium capitalize">{opt}</span>
                        </label>
                    ))}
                </div>

                {/* Input cho Number */}
                {mode === "number" && (
                    <div className="flex gap-3 justify-center">
                        <input
                            type="number"
                            placeholder="Min"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg w-24 text-center focus:ring-2 focus:ring-vintageBrown"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg w-24 text-center focus:ring-2 focus:ring-vintageBrown"
                        />
                    </div>
                )}

                {/* Input cho Text */}
                {mode === "text" && (
                    <textarea
                        placeholder="Nhập các text, cách nhau bằng dấu phẩy..."
                        value={texts}
                        onChange={(e) => setTexts(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-vintageBrown"
                        rows={3}
                    />
                )}

                {/* Buttons */}
                <div className="flex justify-center gap-4 flex-wrap">
                    <button
                        onClick={handleRandom}
                        className="flex items-center gap-2 px-5 py-2 bg-vintageBrown text-vintageCream rounded-lg shadow hover:bg-vintageBrown/90 transition"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        Random
                    </button>

                    {mode === "text" && (
                        <button
                            onClick={handleShuffle}
                            className="flex items-center gap-2 px-5 py-2 bg-vintageGreen text-white rounded-lg shadow hover:bg-vintageGreen/90 transition"
                        >
                            <Shuffle size={18} className={loadingShuff ? "animate-ping" : ""} />
                            Shuffle
                        </button>
                    )}

                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
                    >
                        <XCircle size={18} /> Clear
                    </button>
                </div>

                {/* Kết quả */}
                <div className="mt-4 min-h-[40px] flex flex-col items-center">
                    {(loading || loadingShuff) && (
                        <div className="text-lg font-semibold text-vintageBrown animate-pulse">
                            Đang bốc thăm...
                        </div>
                    )}

                    {result && !loading && (
                        <div className="text-xl font-bold text-vintageBrown">
                            {result}
                        </div>
                    )}

                    {shuffled.length > 0 && !loadingShuff && (
                        <div className="space-y-2 w-full">
                            {shuffled.slice(0, showIndex).map((item, idx) => (
                                <div
                                    key={idx}
                                    className="text-base font-medium bg-vintageCream px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
                                >
                                    <span className="text-gray-500">{idx + 1}.</span> {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
