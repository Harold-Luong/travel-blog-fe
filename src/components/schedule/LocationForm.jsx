
import "trackasia-gl/dist/trackasia-gl.css";

import { Plus } from "lucide-react";
import TagInput from "./TagInput";
import { useState } from "react";

export default function LocationForm({ resetForm, editingIndex }) {
    // tạo function handleChange, handleAddLocation, resetForm, handleSave
    const [formLocation, setFormLocation] = useState({
        name: "",
        address: "",
        lat: null,
        lon: null,
        description: "",
        visitedAt: new Date().toISOString().split("T")[0], // định dạng yyyy-MM-dd
        tagsRequestList: [],
    });
    const [locationList, setLocationList] = useState(null);

    const handleAddLocation = () => {
        if (!formLocation.name || !formLocation.address) {
            toast.error("Please provide a valid name and address for the location.");
            return;
        }
        setLocationList((prev) => [...prev, formLocation]);
        resetForm();
    };

    const handleSaveEdit = () => {

    }

    return (
        <>
            <div className="lg:col-span-2 space-y-4">
                <div className="space-y-4 border p-3 rounded-lg bg-vintageCream/40">
                    {/* Các input giữ nguyên */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Tên điểm đến lấy từ Map</label>
                        <input
                            value={formLocation.name}
                            onChange={(e) => setFormLocation((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Ví dụ: Bãi biển Mỹ Khê"
                            className="w-full border rounded-lg p-2 bg-vintageCream"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Địa chỉ</label>
                        <input
                            value={formLocation.address}
                            onChange={(e) => setFormLocation((prev) => ({ ...prev, address: e.target.value }))}
                            className="w-full border rounded-lg p-2 bg-vintageCream"
                            placeholder="Ví dụ: Đà Nẵng, Việt Nam"
                        />
                    </div>
                    {/* input location lon, lat */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Kinh độ (Longitude)</label>
                            <input
                                type="number"
                                value={formLocation.lon || ""}
                                onChange={(e) => setFormLocation((prev) => ({ ...prev, lon: parseFloat(e.target.value) }))}
                                className="w-full border rounded-lg p-2 bg-vintageCream"
                                placeholder="Kinh độ"
                                step="0.000001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Vĩ độ (Latitude)</label>
                            <input
                                type="number"
                                value={formLocation.lat || ""}
                                onChange={(e) => setFormLocation((prev) => ({ ...prev, lat: parseFloat(e.target.value) }))}
                                className="w-full border rounded-lg p-2 bg-vintageCream"
                                placeholder="Vĩ độ"
                                step="0.000001"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Ghi chú</label>
                        <textarea
                            value={formLocation.description}
                            onChange={(e) => setFormLocation((prev) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full border rounded-lg p-2 bg-vintageCream"
                            placeholder="Thêm ghi chú về địa điểm..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Ngày đến</label>
                        <input
                            type="date"
                            value={formLocation.visitedAt || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setFormLocation((prev) => ({ ...prev, visitedAt: e.target.value }))}
                            className="border rounded-lg p-2 bg-vintageCream"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Tags</label>
                        <TagInput
                            value={formLocation.tagsRequestList?.map((t) => t.name) || []}
                            onChange={(tags) =>
                                setFormLocation((prev) => ({
                                    ...prev,
                                    tagsRequestList: tags.map((t) => ({ name: t })),
                                }))
                            }
                        />
                    </div>
                </div>

                {editingIndex !== null ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            💾 Lưu chỉnh sửa
                        </button>
                        <button
                            onClick={resetForm}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                        >
                            ❌ Hủy
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddLocation}
                        className="flex items-center gap-2 mb-4 px-3 py-2 bg-vintageBrown text-white rounded-lg hover:bg-vintageBrown/90 transition"
                    >
                        <Plus size={16} /> Thêm địa điểm
                    </button>
                )}
            </div>

        </>
    )
}
