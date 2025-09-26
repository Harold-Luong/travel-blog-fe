import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import { fetchTrips } from "../../api/trip";
import TripCard from "./TripCard";
import Breadcrumb from "../common/Breadcrumb";

export default function Trip() {
    const [page, setPage] = useState(0);
    const [trips, setTrips] = useState({
        data: [],
        totalPages: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch trips with pagination, assuming user ID is 1 and page size is 6
                const response = await fetchTrips(1, page, 6);
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
        <div className="space-y-6">
            <Breadcrumb />
            <h2 className="text-2xl font-bold">Tất cả chuyến đi của bạn</h2>

            <br></br>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
                {trips.data.map((trip) => (
                    <TripCard
                        key={trip.id}
                        trip={trip}
                    />
                ))}
            </div>
            <Pagination
                page={page}
                totalPages={trips.totalPages}
                onPageChange={setPage}
            />
        </div>

    );
}
