
import { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";
import { formatPrice } from "../../../lib/common.js"

function CoinItem({ coin, market, onRemove }) {
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [supported, setSupported] = useState(true);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!coin) return;
        let mounted = true;
        setLoading(true);
        setSupported(true);

        const symbol = coin.toUpperCase() + "USDT";
        const restBase = market === "spot"
            ? "https://api.binance.com/api/v3/ticker/price?symbol="
            : "https://fapi.binance.com/fapi/v1/ticker/price?symbol=";

        const wsBase = market === "spot"
            ? "wss://stream.binance.com:9443/ws/"
            : "wss://fstream.binance.com/ws/";

        const controller = new AbortController();

        (async () => {
            try {
                // 1) Validate via REST first
                const res = await fetch(restBase + symbol, { signal: controller.signal });
                if (!mounted) return;
                if (!res.ok) {
                    setSupported(false);
                    setPrice(null);
                    return;
                }
                const data = await res.json();
                if (!mounted) return;
                if (!data || (data && !("price" in data) && !data.symbol)) {
                    setSupported(false);
                    return;
                }

                const initialPrice = parseFloat(data.price);
                setPrice(initialPrice);

                // 2) Open WS only after REST confirmed symbol exists
                const stream = `${coin.toLowerCase()}usdt@trade`;
                const ws = new WebSocket(`${wsBase}${stream}`);
                wsRef.current = ws;

                ws.onmessage = (ev) => {
                    if (!mounted) return;
                    try {
                        const msg = JSON.parse(ev.data);
                        if (msg.p) setPrice(parseFloat(msg.p));
                    } catch {

                    }
                };

                ws.onerror = () => {
                    // do not throw, maybe transient network issue
                    console.warn(`WS error for ${symbol} on ${market}`);
                };

            } catch (err) {
                if (err.name !== "AbortError") {
                    setSupported(false);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
            controller.abort();
            if (wsRef.current) {
                try { wsRef.current.close(); } catch { }
                wsRef.current = null;
            }
        };
    }, [coin, market]);

    return (
        <li className="flex justify-between items-center border-b pb-1 text-sm px-2 py-1">
            <div>
                <div className="font-medium">{coin}/USDT <span className="text-gray-400 text-xs">({market})</span></div>
                {!loading && !supported && <div className="text-xs text-red-500">Không hỗ trợ trên market này</div>}
            </div>

            <div className="flex items-center gap-3">
                <span className="font-medium">
                    {price !== null ? formatPrice(price) : (loading ? "Loading..." : "--")}
                </span>
                <button onClick={() => onRemove(coin)} className="p-1 rounded hover:bg-yellow-50">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                </button>
            </div>
        </li>
    );
}

export default CoinItem;
