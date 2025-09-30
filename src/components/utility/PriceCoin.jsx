import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../common/Card";
import { Star } from "lucide-react";
import { formatPrice } from "../common/common.js"



// -------------------- CoinItem --------------------

function CoinItem({ coin, market = "spot", onRemove }) {
    const [price, setPrice] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!coin) return;

        const symbol = coin.toUpperCase() + "USDT";

        // 1. Fetch giá ngay khi mount
        const fetchPrice = async () => {
            try {
                const baseUrl = market === "spot"
                    ? "https://api.binance.com/api/v3/ticker/price?symbol="
                    : "https://fapi.binance.com/fapi/v1/ticker/price?symbol=";
                const res = await fetch(baseUrl + symbol);
                if (!res.ok) throw new Error("REST error");
                const data = await res.json();
                if (data.price) {
                    setPrice(data.price);
                }
            } catch (err) {
                console.error("REST API error:", err.message);
            }
        };
        fetchPrice();

        // 2. Mở WebSocket để update realtime
        const stream = `${coin.toLowerCase()}usdt@trade`;
        const baseWs = market === "spot"
            ? "wss://stream.binance.com:9443/ws/"
            : "wss://fstream.binance.com/ws/";
        const url = `${baseWs}${stream}`;

        let mounted = true;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        // ws.onopen = () => {
        //     console.log("Connect opened url: " + url)
        // }

        ws.onmessage = (ev) => {
            try {
                const msg = JSON.parse(ev.data);
                if (msg.p && mounted) setPrice(parseFloat(msg.p));
            } catch {
                // ignore
            }
        };

        // ws.onclose = () => {
        //     console.log("Connect closed url: " + url)
        // }

        ws.onerror = () => {
            console.error(`WebSocket error ${coin} (${market})`);
        };

        return () => {
            mounted = false;
            try {
                ws.close();
            } catch { }
            wsRef.current = null;
        };
    }, [coin, market]);
    return (
        <li className="flex justify-between items-center border-b pb-1 text-sm">
            <span>
                {coin}/USDT{" "}
                <span className="text-gray-400 text-xs">({market})</span>
            </span>

            <div className="flex items-center gap-3">
                <span className="font-medium">
                    {price !== null ? formatPrice(price) : "Loading..."}
                </span>
                <button onClick={() => onRemove(coin)} className="text-xs">
                    <Star size={16} className="text-yellow-500 fill-yellow-500 cursor-pointer" />
                </button>
            </div>
        </li>
    );
};


// -------------------- InputCoin --------------------
function InputCoin({ handleAdd, market, onError, setCoinCheck }) {
    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    // small debounce for typing -> debouncedInputValue
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedInputValue(inputValue.trim())
            onError("")
            setCoinCheck(null)
        }, 500);
        return () => clearTimeout(t);
    }, [inputValue]);

    // validate symbol existence using Binance REST API when debouncedInputValue changes
    useEffect(() => {
        if (!debouncedInputValue) {
            setIsValid(false);
            setLoading(false);
            return;
        }

        let mounted = true;
        setLoading(true);

        const symbol = debouncedInputValue.toUpperCase();
        const endpoint =
            market === "spot"
                ? `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
                : `https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}USDT`;

        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(endpoint, { signal: controller.signal });

                if (!mounted) return;
                if (!res.ok) {
                    setIsValid(false);
                    onError && onError(`Không tìm thấy coin "${symbol}"`);
                    return;
                }
                const data = await res.json();
                if (!mounted) return;
                if (data && (data.price || data.price === 0 || data.symbol)) {
                    setIsValid(true);
                    setCoinCheck(data.price)
                    onError && onError("");
                } else {
                    setIsValid(false);
                    onError && onError(`Không tìm thấy coin "${symbol}"`);
                }
            } catch (err) {
                if (err.name === "AbortError") return;
                setIsValid(false);
                onError && onError(`Không tìm thấy coin "${symbol}"`);
            } finally { if (mounted) setLoading(false); }
        })();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [debouncedInputValue, market, onError]);

    const onClickAdd = () => {
        const symbol = debouncedInputValue.toUpperCase();
        if (!symbol) {
            onError && onError("Vui lòng nhập symbol");
            return;
        }
        if (!isValid) {
            onError && onError(`Không tìm thấy coin "${symbol}"`);
            return;
        }

        // call parent add (parent also uppercases/handles duplicates)
        handleAdd(symbol);

        // reset local state
        setInputValue("");
        setDebouncedInputValue("");
        setIsValid(false);
        setCoinCheck(null)
        onError && onError("");
    };


    return (
        <div className="flex gap-2 items-center">
            <input
                type="text"
                placeholder="BTC, ETH ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border rounded px-2 py-1 flex-1 text-sm"
            />

            <button
                onClick={onClickAdd}
                disabled={!debouncedInputValue || !isValid || loading}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Add
            </button>
        </div>
    );
}

// -------------------- PriceCoin (main) --------------------
export default function PriceCoin() {
    const [coins, setCoins] = useState([]);
    const [error, setError] = useState("");
    const [market, setMarket] = useState("spot");
    const [coinCheck, setCoinCheck] = useState(null)
    const loadedRef = useRef(false);

    // load coins for the selected market
    useEffect(() => {
        const key = market === "spot" ? "favCoins_spot" : "favCoins_futures";
        try {
            const raw = localStorage.getItem(key);
            const saved = raw ? JSON.parse(raw) : [];
            setCoins(Array.isArray(saved) ? saved : []);
        } catch (e) {
            setCoins([]);
        } finally {
            // mark that we've loaded at least once for this market
            loadedRef.current = true;
        }
    }, [market]);

    // persist coins when they change (for current market)
    useEffect(() => {
        if (!loadedRef.current) return; // avoid overwriting during the very first load
        const key = market === "spot" ? "favCoins_spot" : "favCoins_futures";
        try {
            localStorage.setItem(key, JSON.stringify(coins));
        } catch (e) {
            // ignore localStorage failures
        }
    }, [coins, market]);

    const handleAdd = (v) => {
        const symbol = v.toUpperCase();
        if (!symbol) return;

        setError("");
        setCoins((prev) => {
            if (prev.includes(symbol)) {
                setError(`Coin "${symbol}" đã tồn tại`);
                return prev;
            }
            // prepend so the newest appear on top
            return [symbol, ...prev];
        });
    };

    const handleRemove = (c) => {
        setCoins((prev) => prev.filter((coin) => coin !== c));
    };

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

                {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                )}

                {coinCheck !== null && (
                    <span className="font-medium">{formatPrice(coinCheck)}</span>
                )}
                <div className="mt-4">
                    {coins.length === 0 ? (
                        <div className="text-gray-500 text-sm">Chưa có coin nào</div>
                    ) : (
                        <ul className="space-y-2">
                            {coins.map((c) => (
                                <CoinItem key={c} coin={c} market={market} onRemove={handleRemove} />
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
