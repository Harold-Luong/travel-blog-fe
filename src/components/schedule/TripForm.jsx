
import { Calendar, Image as ImageIcon, Map, ClipboardList, IdCardIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function TripForm({ saveTrip, tripDetailUpdate }) {
    const [tripForm, setTripForm] = useState({
        userId: 1, // khi hoàn thiện auth, lấy userId từ token
        id: null,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        thumbnail: "",
        status: 1,
    });

    // Helper: convert "dd-MM-yyyy" -> "yyyy-MM-dd"
    const toInputDate = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };

    // Load dữ liệu từ `tripDetailUpdate` khi component mount hoặc khi `tripDetailUpdate` thay đổi
    useEffect(() => {
        if (tripDetailUpdate) {
            setTripForm({
                ...tripDetailUpdate,
                startDate: toInputDate(tripDetailUpdate.startDate) || "",
                endDate: toInputDate(tripDetailUpdate.endDate) || "",
            });
        }
    }, [tripDetailUpdate]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setTripForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSaveTrip = () => {
        saveTrip(tripForm);
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-center text-amber-800">
                ✦ {tripForm.id ? "Cập nhật chuyến đi" : "Tạo chuyến đi mới"} ✦
            </h2>

            {/* Form nhập thông tin */}
            {tripForm.id && (
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <IdCardIcon className="w-4 h-4 text-amber-600" />ID chuyến đi
                    </label>
                    <input
                        type="text"
                        name="id"
                        value={tripForm.id}
                        disabled
                        className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <Map className="w-4 h-4 text-amber-600" /> Tên chuyến đi
                </label>
                <input
                    type="text"
                    name="title"
                    value={tripForm.title || ""}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: Du lịch biển mùa hè"
                    className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                />
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <ClipboardList className="w-4 h-4 text-amber-800" /> Mô tả
                </label>
                <textarea
                    name="description"
                    value={tripForm.description || ""}
                    onChange={handleFormChange}
                    placeholder="Thêm mô tả ngắn gọn về chuyến đi..."
                    className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    rows={3}
                />
            </div>

            {/* Ngày */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-amber-600" /> Ngày bắt đầu
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={tripForm.startDate || ""}
                        onChange={handleFormChange}
                        className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-amber-600" /> Ngày kết thúc
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={tripForm.endDate || ""}
                        onChange={handleFormChange}
                        className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>
            </div>

            {/* Ảnh bìa */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="w-4 h-4 text-amber-600" /> Ảnh bìa (URL)
                </label>
                <input
                    type="text"
                    name="thumbnail"
                    value={tripForm.thumbnail || ""}
                    onChange={handleFormChange}
                    placeholder="Dán link ảnh bìa..."
                    className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {tripForm.thumbnail && (
                    <div className="mt-2">
                        <img
                            src={tripForm.thumbnail}
                            alt="Thumbnail preview"
                            className="rounded-xl shadow max-h-48 object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                    name="status"
                    value={tripForm.status || 1}
                    onChange={handleFormChange}
                    className="w-full border border-amber-200 bg-[#FFFDF6] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                    <option value={1}>Đang lên kế hoạch</option>
                    <option value={2}>Đang thực hiện</option>
                    <option value={3}>Hoàn thành</option>
                    <option value={4}>Đã hủy</option>
                </select>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-between items-center pt-4 border-t border-amber-200">
                <button
                    onClick={handleSaveTrip}
                    className="px-5 py-2 rounded-xl border border-amber-700 text-amber-700 bg-white shadow hover:bg-amber-50 transition"
                >
                    {tripForm.id ? "💾 Lưu Thay đổi" : "Tạo mới"}
                </button>
                <button
                    onClick={handleSaveTrip}
                    className="px-6 py-2 rounded-xl bg-amber-700 text-white shadow hover:bg-amber-800 transition"
                >
                    {tripForm.id ? "Tiếp tục cập nhật điểm đến →" : "Tiếp tục thêm điểm đến →"}
                </button>
            </div>
        </>
    )
}
