import { useState, useEffect } from "react";
import { Edit2, PlusCircleIcon, PlusIcon, SaveAllIcon, Trash2, X } from "lucide-react";
import LocationSearch from "./LocationSearch";

/**
 * "days": [
    {
      "dayIndex": 0,
      "date": "2025-12-01",
      "note": "Ngày đầu tiên",
      "activities": [
        {
            "location": {
                "name": "Quan truong lam vien",
                "latitude": 10.101,
                "longitude": 101.123,
                "address": " Da lat" 
        },
            "activityName": "Check-in quảng trường Lâm Viên",
            "activityTime": "09:00"
        },

        {
          "location": {
                "name": "cau rong",
                "latitude": 11.101,
                "longitude": 102.123,
                "address": " Da nang"
          },
          "activityName": "Ăn trưa ở nhà hàng Memory",
          "activityTime": "12:00"
        }
      ]
 * 
 * @param {*} param0 
 * @returns 
 */
export default function DayItinerary({ colors, day, onAddActivity = null, onEditActivity = null, onDeleteActivity = null }) {

    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [dayActivities, setDayActivities] = useState([]);
    const dayIndex = day?.dayIndex || 0;
    const [formActivity, setFormActivity] = useState({});

    // dayActivities chứa nhiều hoạt động trong ngày (formActivity chỉ là hoạt động đang thêm/sửa). Khi Lưu hoặc Sửa hoạt động, cần cập nhật lại dayActivities
    // đưa vào useEffect để khi day thay đổi (khi chọn ngày khác), cập nhật lại dayActivities.
    useEffect(() => {
        if (Array.isArray(day?.activities)) {
            setDayActivities(day.activities);
        }
    }, [day]);

    const handleSave = () => {
        // Save as new activity
        if (!onAddActivity) {
            resetForm();
            return;
        }
        // ensure activity shape
        const activity = {
            dayIndex: dayIndex,
            activityTime: formActivity.activityTime || "",
            activityName: formActivity.activityName || "",
            status: formActivity.status || "PLANNING",
            location: formActivity.location || {},
        };
        onAddActivity(dayIndex, activity);
        resetForm();
    }
    const resetForm = () => {
        setFormActivity({});
        setShowForm(false);
        setIsEdit(false);
        setEditIndex(null);
    }
    const startEditActivity = (index) => {
        const act = (day.activities || [])[index];
        setFormActivity({
            activityTime: act.activityTime || "",
            activityName: act.activityName || "",
            status: act.status || "PLANNING",
            location: act.location || {},
        });
        setIsEdit(true);
        setEditIndex(index);
    }

    const handleChange = (field, value) => {
        setFormActivity((prev) => ({
            ...prev,
            [field]: value,
        }));
    }
    const onEditLocal = () => {
        if (editIndex === null) return;
        if (!onEditActivity) {
            resetForm();
            return;
        }
        const activity = {
            activityTime: formActivity.activityTime || "",
            activityName: formActivity.activityName || "",
            status: formActivity.status || "PLANNING",
            location: formActivity.location || {},
        };
        onEditActivity(dayIndex, editIndex, activity);
        resetForm();
    }

    const onDeleteLocal = (index) => {
        if (!onDeleteActivity) return;
        onDeleteActivity(dayIndex, index);
    }

    return (
        <div className="flex border border-amber-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md bg-amber-50/50 transition-all duration-300">

            {/* DAY label */}
            <div
                className="text-white font-bold text-lg flex items-center justify-center w-10 tracking-wide"
                style={{
                    backgroundColor: colors[dayIndex] || "#c27312ff", // amber-50 = #b4790bff
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                }}
            >
                Ngày {dayIndex + 1}
            </div>


            {/* Activities list */}
            <div className="flex-1 p-2 md:p-4s space-y-4">
                {day?.date && (
                    <span className="text-amber-700 text-sm font-medium ml-1">{day.date}</span>
                )}
                {/* Header */}
                <div className="grid grid-cols-[1fr_3.5fr_4fr_0.35fr_0.35fr] text-sm font-semibold text-gray-700 border-b border-amber-200 pb-2 mb-3 gap-x-2">
                    <span>Giờ</span>
                    <span>Hoạt động</span>
                    <span>Địa chỉ</span>
                    {/* <span className="text-center">Trạng thái</span> */}
                    <span className="text-center">Sửa</span>
                    <span className="text-center">Xóa</span>
                </div>

                {/* Activities */}
                <div className="space-y-2">
                    {(dayActivities || []).map((act, idx) => (
                        <div key={idx} >
                            {isEdit && editIndex === idx ? (
                                <div className="relative grid grid-cols-[1fr_3.5fr_4fr_0.35fr_0.35fr] items-start border-b border-dashed border-gray-300 pb-1 text-sm gap-x-2">
                                    <input
                                        type="time"
                                        value={formActivity.activityTime}
                                        onChange={(e) => handleChange("activityTime", e.target.value)}
                                        className="input-field text-sm sm:col-span-1"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mô tả hoạt động"
                                        value={formActivity.activityName}
                                        onChange={(e) => handleChange("activityName", e.target.value)}
                                        className="input-field text-sm sm:col-span-1"
                                    />
                                    {/* Địa chỉ + autocomplete */}
                                    <LocationSearch onLocationSelect={(location) => handleChange("location", location)} locationEdit={formActivity.location} />

                                    <button
                                        onClick={onEditLocal}
                                        className="flex justify-center items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        title="Save activity">
                                        <SaveAllIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        className="flex justify-center items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        title="Cancel activity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative grid grid-cols-[1fr_3.5fr_4fr_0.35fr_0.35fr] items-start border-b border-dashed border-gray-300 pb-1 text-sm gap-x-2">
                                    <span className="text-gray-600 text-md ">{act.activityTime}</span>
                                    <span className="text-gray-800 text-md ">{act.activityName}</span>

                                    <span className="text-xs text-gray-800 mb-1 mt-1">
                                        📍 {act.location?.name} - {act.location?.address}
                                        <br />
                                        🌐 ({act.location?.latitude}, {act.location?.longitude})
                                    </span>


                                    <button
                                        onClick={() => startEditActivity(idx)}
                                        className="flex justify-center items-center text-gray-400 hover:text-amber-700 transition-colors duration-200"
                                        title="Edit activity"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteLocal(idx)}
                                        className="flex justify-center items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        title="Delete activity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add button */}
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className=" mt-3 rounded-full text-sm font-medium text-white hover:bg-amber-600 transition-all duration-200 flex items-center justify-center"
                            style={{
                                backgroundColor: colors[dayIndex]

                            }}
                        >
                            <PlusCircleIcon className="w-6 h-6 inline-block" />

                        </button>
                    )}
                    {/* Add form */}
                    {showForm && (
                        <div className="relative grid grid-cols-[1fr_3.5fr_4fr_0.35fr_0.35fr] items-start  border-b border-dashed border-gray-300 pb-1 text-sm gap-x-2">
                            <input
                                type="time"
                                value={formActivity.activityTime}
                                onChange={(e) => handleChange("activityTime", e.target.value)}
                                className="input-field text-sm sm:col-span-1"
                            />
                            <input
                                type="text"
                                placeholder="Mô tả hoạt động"
                                value={formActivity.activityName}
                                onChange={(e) => handleChange("activityName", e.target.value)}
                                className="input-field text-sm sm:col-span-1"
                            />

                            {/* Địa chỉ + autocomplete */}
                            <LocationSearch onLocationSelect={(location) => handleChange("location", location)} locationEdit={formActivity.location} />

                            <button
                                onClick={handleSave}
                                className="self-center flex justify-center items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                                title="Save activity">
                                <SaveAllIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={resetForm}
                                className="self-center flex justify-center items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                                title="Cancel activity">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}
