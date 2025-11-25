import { CalendarDays, MoveRight, Tag } from "lucide-react";

export default function TripHeader({ trip }) {
    return (
        <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Tag /> {trip.title}
            </h1>

            <p className="text-gray-600 mb-4">{trip.description}</p>
            <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {trip.status}
                </span>

                <div className="flex items-center text-gray-600 gap-2">
                    <CalendarDays className="w-5 h-5" />
                    <span className="text-sm flex items-center gap-1">
                        {new Date(trip.startDate).toLocaleDateString("en-GB")}
                        <MoveRight className="w-4 h-4" />
                        {new Date(trip.endDate).toLocaleDateString("en-GB")}
                    </span>
                </div>
            </div>
        </div>
    );
}
