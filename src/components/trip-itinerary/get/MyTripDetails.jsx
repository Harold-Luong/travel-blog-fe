import { useEffect, useState, useMemo } from "react";
import RightDrawerMapReview from "../create/RightDrawerMapReview";
import generateDistinctColors from "../create/GenerateDistinctColors";
import { fetchTripDetailsBySlug } from "../../../api/trip";
import Breadcrumb from "../../common/Breadcrumb";
import TripDayCard from "./TripDayCard";
import TripHeader from "./TripHeader";

export default function MyTripDetails({ slug }) {
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetchTripDetailsBySlug(slug);
                setTripDetails(response.data || []);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [slug]);

    const colors = useMemo(() => {
        return tripDetails?.days?.length
            ? generateDistinctColors(tripDetails.days.length)
            : [];
    }, [tripDetails]);

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (error) return <div className="p-6 text-center">Error loading trip details.</div>;
    if (!tripDetails) return <div className="p-6">No trip details available.</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <Breadcrumb
                items={[
                    { label: "Trip", path: "/my-trip" },
                    { label: "Trip Details" }
                ]}
            />

            <div className="mt-6 mx-auto">
                {/* Map Drawer */}
                <RightDrawerMapReview days={tripDetails.days} colors={colors} />

                {/* Header */}
                <TripHeader trip={tripDetails} />

                {/* Days */}
                <div className="space-y-6 mt-8">
                    {tripDetails.days.map((day) => (
                        <TripDayCard key={day.id} day={day} color={colors[day.dayIndex]} />
                    ))}
                </div>
            </div>
        </div>
    );
}
