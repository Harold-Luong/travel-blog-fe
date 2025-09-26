import { Link } from "react-router-dom";

export default function TripCard({ trip }) {
    if (!trip) return null;
    const thumbnail = trip.thumbnail || 'default-thumbnail.jpg';
    const description = trip.description || 'No description available';
    const title = trip.title || 'Untitled Trip';
    const id = trip.id || 'unknown';
    const startDate = trip.startDate || 'Unknown start date';
    const endDate = trip.endDate || 'Unknown end date';

    return (
        <div className="bg-white relative shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                {trip.status}
            </div>
            <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-vintageBrown">{title}</h2>
                <p className="text-gray-700 mb-4">{description}</p>
                <p className="text-sm text-gray-500">Start Date: {startDate}</p>
                <p className="text-sm text-gray-500">End Date: {endDate}</p>
                <Link to={`/trips/${id}`} className="text-vintageBrown hover:underline">View Details</Link>
            </div>
        </div>
    );
}
