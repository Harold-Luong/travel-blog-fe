import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../common/Card";

export default function ExchangeCurrency() {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("VND");
    const [rate, setRate] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch tỷ giá khi fromCurrency thay đổi
    useEffect(() => {
        const fetchRate = async () => {
            if (!fromCurrency) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
                const data = await res.json();

                if (data?.rates) {
                    setRate(data.rates);
                } else {
                    setError("Không lấy được tỷ giá");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRate();
    }, [fromCurrency]);

    // Tính kết quả khi amount / toCurrency / rate thay đổi
    useEffect(() => {
        if (rate && toCurrency) {
            const value = amount * (rate[toCurrency] || 0);
            setResult(
                Number(value.toFixed(2)).toLocaleString("vi-VN")
            );
        }
    }, [amount, toCurrency, rate]);

    return (
        <Card className="p-4">
            <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Chuyển đổi tiền tệ</div>
                </div>

                {/* Input row */}
                <div className="flex flex-col items-center text-center space-y-2 w-full max-w-sm">
                    {/* Input riêng 1 dòng */}
                    <input
                        type="number"
                        value={amount}
                        min={1}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-vintageBrown"
                    />

                    {/* 2 select + chữ "to" cùng 1 hàng */}
                    <div className="flex flex-row items-center space-x-2 w-full">
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className="border rounded-lg p-2 flex-1"
                        >
                            {Object.keys(rate).map((cur) => (
                                <option key={cur} value={cur}>
                                    {cur}
                                </option>
                            ))}
                        </select>

                        <span className="px-2">to</span>

                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className="border rounded-lg p-2 flex-1"
                        >
                            {Object.keys(rate).map((cur) => (
                                <option key={cur} value={cur}>
                                    {cur}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Result */}
                {loading && <p className="animate-pulse">Đang tải...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {result && !loading && !error && (
                    <CardFooter className="flex flex-col items-center text-center space-y-2 w-full max-w-sm">
                        <p className="text-lg font-semibold animate-fade-in">
                            {amount} {fromCurrency} ={" "}
                            <span className="px-2 py-1 bg-vintageBrown text-white rounded-lg shadow">
                                {result}
                            </span>{" "}
                            {toCurrency}
                        </p>
                    </CardFooter>
                )}
            </CardContent>
        </Card >
    );
}
