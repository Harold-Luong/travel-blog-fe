export function formatPrice(price) {
    const value = parseFloat(price);

    if (isNaN(value)) return "-";

    if (value >= 100) {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    } else if (value >= 0.0009) {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 5,
        });
    } else {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
        });
    }
}
