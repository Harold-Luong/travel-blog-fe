import { useEffect, useState } from "react";
import { fetchTrips } from "../../../../api/trip";
import Breadcrumb from "../../../common/Breadcrumb";
import Pagination from "../../../common/Pagination";
import { Link } from "react-router-dom";

export default function MyTripList() {
    const size = 3;

    const [page, setPage] = useState(0);
    const [trips, setTrips] = useState({
        data: [],
        totalPages: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchTrips(page, size);
                if (Array.isArray(response.data)) {
                    setTrips({ data: response.data, totalPages: response.totalPages });
                } else {
                    setTrips(response.data || { data: [], totalPages: response.totalPages });
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };
        fetchData();
    }, [page]);

    return (
        <div className="bg-white p-6 rounded shadow-md" >
            <Breadcrumb items={[{ label: "Chuyến du lịch" }]} />
            <h2 className="text-2xl font-semibold mb-4">Nhật ký du lịch gần đây</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
                {trips.data.map((trip, k) => (
                    <div key={k} className="bg-white relative shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            {trip.status}
                        </div>
                        <img src={trip.thumbnail} alt={trip.title} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-2 text-vintageBrown">{trip.title}</h2>
                            <p className="text-gray-700 mb-4">{trip.description}</p>
                            <p className="text-sm text-gray-500">Ngày bắt đầu: {new Date(trip.startDate).toLocaleDateString("en-GB")}</p>
                            <p className="text-sm text-gray-500">Ngày kết thúc: {new Date(trip.endDate).toLocaleDateString("en-GB")}</p>
                            <Link to={`/trip/${trip.slug}`} className="text-vintageBrown hover:underline">Xem chi tiết</Link>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                page={page}
                totalPages={trips.totalPages}
                onPageChange={setPage}
            />
        </div>
    )
}
