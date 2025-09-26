import { useEffect, useState } from "react";
import Pagination from "../components/common/Pagination";
import { fetchTrips } from "../api/trip"; // Assuming you have a fetchTrips function in api/trip.js
import TripCard from "../components/trip/TripCard";


export default function Home() {
    const [page, setPage] = useState(0);
    const [trips, setTrips] = useState({
        data: [],
        totalPages: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchTrips(1, page, 3);
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
        <div>
            <h2 className="text-2xl font-semibold mb-4">My recent travel diary</h2>
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
