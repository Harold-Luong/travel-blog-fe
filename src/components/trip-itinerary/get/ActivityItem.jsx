import StatusSelector from "./StatusSelector";
import { useState } from "react";

export default function ActivityItem({ activity }) {
    const [status, setStatus] = useState(activity.status);

    return (
        <div className="flex flex-col gap-3 p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <div className="flex gap-4">
                {activity.location?.thumbnailUrl && (
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
                                {activity.location?.name} — {activity.location?.address}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-sm">
                            <StatusSelector id={activity.id} onUpdate={(st) => setStatus(st)} st={status} />
                            <span className="text-xs px-2 py-1 bg-gray-200 rounded font-medium">
                                {activity.activityTime}
                            </span>
                        </div>
                    </div>
                    {activity.location?.description && (
                        <p className="text-sm text-gray-600 mt-2">{activity.location.description}</p>
                    )}
                    {activity.note ? (
                        <p className="mt-2 text-sm text-gray-700 italic">“{activity.note}”</p>
                    )
                        : <p className="mt-2 text-sm text-gray-700 italic">“-”</p>
                    }
                </div>
            </div>
        </div>
    );
}
