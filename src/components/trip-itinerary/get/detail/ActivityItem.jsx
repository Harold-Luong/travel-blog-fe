
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useState, useMemo } from "react";
import { updatStatusActivity } from "../../../../api/activity";

const ACTIVITY_STATUS = ["PLANNING", "ONGOING", "COMPLETED", "SKIPPED"];

export default function ActivityItem({ activity }) {

    const [status, setStatus] = useState(activity.status);

    const handleChange = async (e) => {
        const newStatus = e.target.value;

        try {
            const req = await updatStatusActivity(activity.id, { status: newStatus });
            toast.success("Chuyển đổi Status thành công!");
            setStatus(req);
        } catch (error) {
            toast.error("Lưu Status thất bại. Vui lòng thử lại.");
        }
    };

    const statusColor = useMemo(() => {
        return {
            PLANNING: "bg-gray-100 text-gray-700",
            ONGOING: "bg-yellow-100 text-yellow-700",
            COMPLETED: "bg-green-100 text-green-700",
            SKIPPED: "bg-red-100 text-red-700",
        }[status] || "bg-gray-100 text-gray-700";
    }, [status]);

    const StatusIcon = useMemo(() => {
        switch (status) {
            case "COMPLETED": return CheckCircle;
            case "ONGOING": return Clock;
            case "SKIPPED": return XCircle;
            default: return Clock;
        }
    }, [status]);
    const Icon = StatusIcon;

    return (
        <div className="flex flex-col gap-3 p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <div className="flex gap-4">
                {activity.location.thumbnailUrl && (
                    <img
                        src={activity.location.thumbnailUrl}
                        className="w-24 h-24 object-cover rounded-xl shadow-sm"
                        alt={activity.activityName}
                    />
                )}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold leading-tight">{activity.activityName}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {activity.location.name} — {activity.location.address}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-sm">
                            <div className={`flex items-center px-2 py-1 rounded-full ${statusColor} `}>
                                <span><Icon size={15} /></span>
                                <select
                                    value={status}
                                    onChange={handleChange}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${statusColor} focus:outline-none cursor-pointer`}>
                                    {ACTIVITY_STATUS.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <span className={`text-xs px-2 py-1 ${statusColor} rounded font-medium`}>
                                {activity.activityTime}
                            </span>
                        </div>
                    </div>
                    {activity.location.description && (
                        <p className="text-sm text-gray-600 mt-2">{activity.location.description}</p>
                    )}
                    {activity.note ? (
                        <p className="mt-2 text-sm text-gray-700 italic">“{activity.note}”</p>
                    )
                        : <p className="mt-2 text-sm text-gray-700 italic">“----------”</p>
                    }
                </div>
            </div>
        </div>
    );
}
