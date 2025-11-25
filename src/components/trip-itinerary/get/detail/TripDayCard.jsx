import { MapPin } from "lucide-react";
import ActivityItem from "./ActivityItem";

export default function TripDayCard({ day, color, handleClickMapPin }) {

    return (
        <div className="border rounded-xl p-6 shadow-sm bg-white">
            <div className="relative mb-3">
                <h2 className="text-xl font-semibold">
                    Ngày {day.dayIndex} — {new Date(day.date).toLocaleDateString('en-GB')}
                </h2>

                <button
                    onClick={handleClickMapPin}
                    title={"Màu trên Map"}
                    className="absolute top-0 right-0 w-7 h-7">
                    <MapPin style={{ color: color }}
                    />
                </button>
            </div >

            <p className="text-gray-500 mb-4">{day.note}</p>

            <div className="space-y-4">
                {day.activities.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} date={day.date} />
                ))}
            </div>
        </div >
    );
}
