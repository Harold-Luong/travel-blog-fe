import { useEffect, useState } from "react";

export default function InputCoin({ handleAdd, market, onError, setCoinCheck }) {
    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedInputValue(inputValue.trim())
            onError("")
            setCoinCheck(null)
        }, 500);
        return () => clearTimeout(t);
    }, [inputValue]);

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
                className="border border-gray-300 rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-vintageBrown/70 transition"
            />

            <button
                onClick={onClickAdd}
                disabled={!debouncedInputValue || !isValid || loading}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-vintageBrown to-vintageBrown/90 text-vintageCream rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
            >
                Add
            </button>
        </div>
    );
}