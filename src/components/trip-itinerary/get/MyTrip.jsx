import { fetchTrips } from "../../../api/trip";
import { useEffect, useState } from "react";
import Pagination from "../../common/Pagination";
import Breadcrumb from "../../common/Breadcrumb";
import TripCardList from "./TripCardList";

export default function MyTrip() {

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetchTripDetailsByUser();
    //             setTrips(response.data);
    //         } catch (error) {
    //             console.error("Error fetching trips:", error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const [tripSelected, setTripSelected] = useState();
    const [page, setPage] = useState(0);
    const [trips, setTrips] = useState({
        data: [],
        totalPages: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchTrips(page, 6);
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
            <Breadcrumb
                items={[
                    { label: "Trip" },
                ]}
            />
            <h2 className="text-2xl font-semibold mb-4">My recent travel diary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
                {trips.data.map((trip) => (
                    <TripCardList
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
    )
}
