import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import TripForm from "./TripForm";
import { createTravelItinerary } from "../../../api/trip";
import Breadcrumb from "../../common/Breadcrumb";
import TripPlanning from "./TripPlanning";
import RightDrawerMapReview from "./RightDrawerMapReview";
import MapCommon from "../../map/MapCommon";
import generateDistinctColors from "./GenerateDistinctColors";

/**
 *ex:
 * {
 *   "title": "Hành trình Đà Lạt 5 ngày",
 *   "description": "Khám phá Đà Lạt và thưởng thức ẩm thực",
 *   "startDate": "2025-12-01",
 *   "endDate": "2025-12-05",
 *   "status": "PLANNING"
 * }
 *
 * @returns
 */
export default function TripItineraryPage() {
    const [tripRequest, setTripRequest] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "PLANNING",
        days: [],
    });

    const colors = useMemo(() => generateDistinctColors(tripRequest.days.length), [tripRequest.days.length]);

    useEffect(() => {
        const { startDate, endDate } = tripRequest;
        if (!startDate || !endDate) {
            setTripRequest((prev) => ({ ...prev, days: [] }));
            return;
        }

        const s = new Date(startDate);
        const e = new Date(endDate);
        if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) {
            setTripRequest((prev) => ({ ...prev, days: [] }));
            return;
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.round((e - s) / msPerDay) + 1;
        const newDays = [];
        for (let i = 0; i < diffDays; i++) {
            const d = new Date(s);
            d.setDate(s.getDate() + i);
            newDays.push({ dayIndex: i, date: d.toLocaleDateString("en-GB"), activities: [] });
        }

        setTripRequest((prev) => ({ ...prev, days: newDays }));
    }, [tripRequest.startDate, tripRequest.endDate]);

    // handlers to update activities in the tripRequest.days
    const handleAddActivity = (dayIndex, activity) => {
        setTripRequest((prev) => {
            const days = (prev.days || []).map((d) => {
                if (d.dayIndex === dayIndex) {
                    const acts = [...(d.activities || []), activity];
                    return { ...d, activities: acts };
                }
                return d;
            });
            return { ...prev, days };
        });
    };

    const handleEditActivity = (dayIndex, activityIndex, activity) => {
        setTripRequest((prev) => {
            const days = (prev.days || []).map((d) => {
                if (d.dayIndex === dayIndex) {
                    const acts = [...(d.activities || [])];
                    acts[activityIndex] = activity;
                    return { ...d, activities: acts };
                }
                return d;
            });
            return { ...prev, days };
        });
    };

    const handleDeleteActivity = (dayIndex, activityIndex) => {
        setTripRequest((prev) => {
            const days = (prev.days || []).map((d) => {
                if (d.dayIndex === dayIndex) {
                    const acts = (d.activities || []).filter((_, i) => i !== activityIndex);
                    return { ...d, activities: acts };
                }
                return d;
            });
            return { ...prev, days };
        });
    };

    const handleSaveTripItinerary = async () => {
        try {
            console.log("Payload to save:", tripRequest);
            await createTravelItinerary(tripRequest);
            toast.success("Lưu kế hoạch thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu kế hoạch:", error);
            toast.error("Lưu kế hoạch thất bại. Vui lòng thử lại.");
        }
    };

    const clearItinerary = () => {
        setTripRequest({
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            status: "PLANNING",
            days: [],
        });
    }
    return (
        <div className="space-y-6 ">
            {/* <RightDrawerMapReview days={tripRequest.days} colors={colors} /> */}
            <Breadcrumb
                items={[
                    { label: "Kế hoạch chuyến đi", href: "/trip-itinerary" },
                ]}
            />
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                <div className="col-span-1   ">
                    <TripForm tripRequest={tripRequest} setTripRequest={setTripRequest} />
                </div>
                <div className="col-span-2 ">
                    <MapCommon days={tripRequest.days} colors={colors} />
                </div>
            </div>

            <div className="col-span-2 space-y-6">
                {tripRequest.days.length > 0 ?
                    <h2 className="text-lg font-bold text-amber-700">Kế hoạch cho chuyến đi</h2>
                    : <h2 className="text-lg font-bold text-amber-700">Chưa có kế hoạch cho chuyến đi</h2>
                }
                <TripPlanning
                    startDate={tripRequest.startDate}
                    endDate={tripRequest.endDate}
                    days={tripRequest.days}
                    colors={colors}
                    onAddActivity={handleAddActivity}
                    onEditActivity={handleEditActivity}
                    onDeleteActivity={handleDeleteActivity}
                />
            </div>

            <hr className="border-t border-gray-300" />

            <div className="flex items-center gap-3">
                <button onClick={handleSaveTripItinerary} className="px-3 py-2 bg-vintageBrown text-white rounded-lg hover:opacity-90">
                    Lưu Kế Hoạch
                </button>
                <button
                    onClick={clearItinerary}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                    Xóa tất cả
                </button>
            </div>
        </div>
    );
}
