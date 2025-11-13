import { useState, useMemo } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { updatStatusActivity } from "../../../api/activity";
import { toast } from "react-toastify";
const ACTIVITY_STATUS = ["PLANNING", "ONGOING", "COMPLETED", "SKIPPED"];

export default function StatusSelector({ id, st }) {
    console.log("status")
    const [status, setStatus] = useState(st);

    const handleChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const req = await updatStatusActivity(id, { status: newStatus });
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
    );
}
