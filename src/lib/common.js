/**
 * Format số price theo chuẩn US locale với số lượng chữ số thập phân linh hoạt.
 * 
 * Logic:
 * - Ép giá trị đầu vào thành float (dù là string hay number).
 * - Nếu parse thất bại => trả về "-" (fallback).
 * - Nếu giá trị >= 100 => hiển thị đúng 2 chữ số thập phân (vd: 123.00).
 * - Nếu giá trị >= 0.0009 => hiển thị từ 2 đến 5 chữ số thập phân.
 * - Nếu giá trị < 0.0009 => hiển thị từ 2 đến 8 chữ số thập phân (cho số rất nhỏ).
 * 
 * @param {string|number} price - Giá trị cần format (có thể là số hoặc chuỗi số).
 * @returns {string} Chuỗi số đã được format, hoặc "-" nếu không hợp lệ.
 */
export function formatPrice(price) {
    const value = parseFloat(price);

    // Nếu không parse được thành số => return "-"
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
