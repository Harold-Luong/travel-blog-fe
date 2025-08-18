import { Pen, Trash2 } from 'lucide-react'

export default function LocationsCreatePreview({ trip, locations, handleEdit, handleRemove, editingIndex }) {

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-vintageBrown mb-2">
                📍 Danh sách địa điểm trong chuyến đi: {trip?.title}
            </h3>
            {trip?.trip.startDate && trip.endDate && (
                <p className="text-sm text-gray-600 mb-4">
                    🗓️ Từ <span className="font-medium">{trip.startDate}</span> đến{" "}
                    <span className="font-medium">{trip.endDate}</span>
                </p>
            )}

            {locations.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                    Chưa có địa điểm nào, hãy thêm từ bản đồ hoặc nhập form bên cạnh ✨
                </p>
            ) : (
                <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {locations.map((loc, idx) => (
                        <li
                            key={idx}
                            className="flex justify-between items-start gap-3 border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-vintageCream/30"
                        >
                            <div className="flex-1 space-y-1">
                                <p className="font-semibold text-base text-vintageBrown">
                                    {loc.name || "Chưa đặt tên"}
                                </p>
                                <p className="text-xs text-gray-600">{loc.address}</p>
                                {loc.description && (
                                    <p className="text-xs text-gray-500 italic">✏️ {loc.description}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    🌍 Tọa độ: <span className="font-mono">{loc.lat}</span> -{" "}
                                    <span className="font-mono">{loc.lon}</span>
                                </p>
                                {loc.visitedAt && (
                                    <p className="text-xs text-amber-700 font-medium">
                                        📅 Ngày đến dự kiến: {loc.visitedAt}
                                    </p>
                                )}
                                {loc.tagsRequestList?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {loc.tagsRequestList
                                            .filter((tag) => tag.name.trim() !== "")
                                            .map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                {editingIndex === idx ? null : (
                                    <button onClick={() => handleEdit(idx)} className="text-blue-500 hover:text-blue-700">
                                        <Pen size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleRemove(idx)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
