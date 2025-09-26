import React, { useEffect, useState } from "react";
import { fetchTrips, fetchTripDetailsById } from "../../api/trip";

export default function EditTrip() {
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [localTrip, setLocalTrip] = useState({
        id: null,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        thumbnail: "",
    });
    // helper convert dd-MM-yyyy -> yyyy-MM-dd
    const toInputDate = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };
    // load danh sách trips
    useEffect(() => {
        const loadTrips = async () => {
            try {
                const response = await fetchTrips(1, 0, 999);
                setTrips(response.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách chuyến đi:", error);
            }
        };
        loadTrips();
    }, []);


    useEffect(() => {
        const loadTripDetails = async () => {
            if (selectedTripId) {
                try {
                    const response = await fetchTripDetailsById(selectedTripId);
                    const trip = response.data;

                    setLocalTrip({
                        ...trip,
                        startDate: toInputDate(trip.startDate),
                        endDate: toInputDate(trip.endDate),
                    });
                } catch (error) {
                    console.error("Lỗi khi tải chi tiết chuyến đi:", error);
                }
            } else {
                setLocalTrip({
                    id: null,
                    title: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    thumbnail: "",
                });
            }
        };
        loadTripDetails();
    }, [selectedTripId]);

    // cập nhật form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalTrip((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedTripId) {
            console.log("Cập nhật trip:", localTrip);
            // TODO: updateTrip(localTrip.id, localTrip)
        } else {
            console.log("Tạo mới trip:", localTrip);
            // TODO: createTrip(localTrip)
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Cột trái: chọn trip */}
            <div className="space-y-4 grid-span-1">
                <h2 className="font-bold text-lg">Danh sách chuyến đi</h2>
                <select
                    value={selectedTripId || ""}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full border rounded p-2"
                >
                    <option value="">-- Tạo mới chuyến đi --</option>
                    {trips.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                            {trip.title}
                        </option>
                    ))}
                </select>

            </div>

            {/* Cột phải: form */}
            <div className="col-span-1 md:col-span-3">
                <h2 className="font-bold text-lg mb-4">
                    {selectedTripId ? "Chỉnh sửa chuyến đi" : "Tạo chuyến đi mới"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Tên chuyến đi</label>
                        <input
                            type="text"
                            name="title"
                            value={localTrip.title || ""}
                            onChange={handleChange}
                            placeholder="Ví dụ: Du lịch biển mùa hè"
                            className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Mô tả</label>
                        <textarea
                            name="description"
                            value={localTrip.description || ""}
                            onChange={handleChange}
                            placeholder="Thêm mô tả ngắn gọn về chuyến đi..."
                            className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={localTrip.startDate || ""}
                                onChange={handleChange}
                                className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Ngày kết thúc</label>
                            <input
                                type="date"
                                name="endDate"
                                value={localTrip.endDate || ""}
                                onChange={handleChange}
                                className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Ảnh bìa</label>
                        <input
                            type="text"
                            name="thumbnail"
                            value={localTrip.thumbnail || ""}
                            onChange={handleChange}
                            placeholder="URL ảnh bìa"
                            className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        {localTrip.thumbnail && (
                            <img
                                src={localTrip.thumbnail}
                                alt="cover"
                                className="mt-2 rounded-lg max-h-40 object-cover"
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition"
                    >
                        {selectedTripId ? "Lưu thay đổi và thoát" : "Tạo mới và thoát"}
                    </button>
                </form>
            </div>
        </div>
    );
}
