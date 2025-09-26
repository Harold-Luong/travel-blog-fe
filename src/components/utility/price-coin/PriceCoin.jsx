import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../../common/Card.jsx";
import { formatPrice } from "../../../lib/common.js"
import InputCoin from "./InputCoin.jsx";
import CoinItem from "./CoinItem.jsx";

export default function PriceCoin() {
    const [coinsByMarket, setCoinsByMarket] = useState({ spot: [], futures: [] });
    const [market, setMarket] = useState("spot");
    const [error, setError] = useState("");
    const [coinCheck, setCoinCheck] = useState(null);

    // load once both markets from localStorage
    useEffect(() => {
        try {
            const spot = JSON.parse(localStorage.getItem("favCoins_spot") || "[]");
            const futures = JSON.parse(localStorage.getItem("favCoins_futures") || "[]");
            setCoinsByMarket({
                spot: Array.isArray(spot) ? spot : [],
                futures: Array.isArray(futures) ? futures : [],
            });
        } catch {
            setCoinsByMarket({ spot: [], futures: [] });
        }
    }, []);

    // persist whenever coinsByMarket changes
    useEffect(() => {
        try {
            localStorage.setItem("favCoins_spot", JSON.stringify(coinsByMarket.spot));
            localStorage.setItem("favCoins_futures", JSON.stringify(coinsByMarket.futures));
        } catch {
            // ignore
        }
    }, [coinsByMarket]);

    const handleAdd = (symbol) => {
        setError("");
        setCoinsByMarket(prev => {
            const list = prev[market];
            if (list.includes(symbol)) {
                setError(`Coin "${symbol}" đã tồn tại`);
                return prev;
            }
            return { ...prev, [market]: [symbol, ...list] };
        });
    };

    const handleRemove = (symbol) => {
        setCoinsByMarket(prev => ({
            ...prev,
            [market]: prev[market].filter(s => s !== symbol)
        }));
    };

    const coins = coinsByMarket[market];

    return (
        <Card className="p-4">
            <CardContent>
                <div className="flex items-center gap-3 mb-3">
                    <label className="text-sm font-medium">Chọn thị trường:</label>
                    <select
                        value={market}
                        onChange={(e) => setMarket(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value="spot">Spot</option>
                        <option value="futures">Futures (USDT-M)</option>
                    </select>
                </div>

                <InputCoin handleAdd={handleAdd} market={market} onError={setError} setCoinCheck={setCoinCheck} />

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                {coinCheck !== null && <div className="font-medium mt-2">{formatPrice(coinCheck)}</div>}

                <div className="mt-4">
                    {coins.length === 0 ? (
                        <div className="text-gray-500 text-sm">Chưa có coin nào</div>
                    ) : (
                        <ul className="space-y-2">
                            {coins.map(c => (
                                // CHÚ Ý: include market trong key để ép React unmount/mount lại khi market thay đổi
                                <CoinItem key={`${market}-${c}`} coin={c} market={market} onRemove={handleRemove} />
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}