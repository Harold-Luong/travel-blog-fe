import { useEffect, useState, useMemo } from "react";
import RightDrawerMapReview from "../../create/RightDrawerMapReview";
import generateDistinctColors from "../../create/GenerateDistinctColors";
import { fetchTripDetailsBySlug } from "../../../../api/trip";
import Breadcrumb from "../../../common/Breadcrumb";
import TripDayCard from "./TripDayCard";
import TripHeader from "./TripHeader";

export default function MyTripDetails({ slug }) {
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false)

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

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-center">Có lỗi khi lấy thông tin chuyến đi.</div>;
    if (!tripDetails) return <div className="p-6">Không có chuyến đi nào!</div>;

    const handleClickMapPin = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <Breadcrumb
                items={[
                    { label: "Trip", path: "/my-trip" },
                    { label: "Trip Details" }
                ]}
            />
            <div className="mt-6 mx-auto">
                <RightDrawerMapReview days={tripDetails.days} colors={colors} isOpen={isOpen} />
                <TripHeader trip={tripDetails} />
                <div className="space-y-6 mt-8">
                    {tripDetails.days.map((day) => (
                        <TripDayCard key={day.id} day={day} color={colors[day.dayIndex]} handleClickMapPin={handleClickMapPin} />
                    ))}
                </div>
            </div>
        </div>
    );
}
