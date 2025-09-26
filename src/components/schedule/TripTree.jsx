import { MinusCircle } from "lucide-react";
import { useMemo } from "react";

export default function TripTree({
    tripList, // Danh sách chuyến đi chỉ thông tin cơ bản của Trip, không có locations
    selectedTripId, // ID chuyến đi đang chọn
    setSelectedTripId, // Hàm cập nhật ID chuyến đi đang chọn
    // onSelectTrip, // Hàm gọi khi chọn chuyến đi mới
    loading,
    tripDetails, // Chi tiết chuyến đi bao gồm locations
    onDeleteLocation,
}) {

    // Xử lý thay đổi dropdown
    const handleSelectChange = (e) => {
        const newTripId = e.target.value;
        if (newTripId !== selectedTripId) {
            setSelectedTripId(newTripId);
        }
    };

    const locations = tripDetails?.locations || [];
    console.log('locations', locations);
    return (
        <div className="space-y-4 col-span-1 md:col-span-2 justify-self-center w-full">
            <h2 className="font-bold text-lg">Danh sách các chuyến đi</h2>

            {/* Dropdown chọn chuyến đi */}
            {loading ? (
                <p>Đang tải...</p>
            ) : tripList.length === 0 ? (
                <p>Không có chuyến đi nào.</p>
            ) : (
                <select
                    value={selectedTripId || ""}
                    onChange={handleSelectChange}
                    className="w-full border rounded p-2"
                >
                    <option value="">-- Chọn Trip để cập nhật --</option>
                    {tripList.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                            {trip.title}
                        </option>
                    ))}
                </select>
            )}

            {/* Hiển thị chi tiết chuyến đi */}
            {tripDetails?.id ? (
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="pl-2">
                        {/* Thông tin chuyến đi */}
                        <div className="flex items-center mb-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            <span className="font-semibold text-gray-700">{tripDetails?.title}</span>
                        </div>

                        {/* Danh sách địa điểm */}
                        <ul className="ml-6 border-l border-gray-300 space-y-2">
                            {locations.length > 0 ? (
                                locations.map((loc) => (
                                    <li key={loc.id} className="relative pl-4 group">
                                        {/* Đường nối */}
                                        <span className="absolute left-0 top-2 w-3 h-px bg-gray-300"></span>

                                        {/* Node */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 text-green-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 4v16m8-8H4"
                                                    />
                                                </svg>
                                                <span className="text-gray-600 group-hover:text-blue-600 transition">
                                                    {loc.name}
                                                </span>
                                            </div>

                                            {/* Nút xóa địa điểm */}
                                            <button
                                                onClick={() => onDeleteLocation?.(loc.id)}
                                                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <MinusCircle size={18} />
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">Không có địa điểm nào trong chuyến đi này.</p>
                            )}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Hãy chọn một chuyến đi để xem chi tiết.</p>
            )}
        </div>
    );
}