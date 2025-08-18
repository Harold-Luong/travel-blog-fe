import { useState, useEffect, useCallback } from "react";
import { createTrip, fetchTripDetailsById, fetchTrips, updateTrip } from "../../api/trip";
import { toast } from "react-toastify";
import TripTree from "./TripTree";
import TripForm from "./TripForm";
import LocationForm from "./LocationForm";

export default function TripCreate({ handleTripChange, nextStep }) {
    const [trip, setTrip] = useState({
        userId: 1,
        id: null,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        thumbnail: "",
        status: 1,
    });

    const [selectedTripId, setSelectedTripId] = useState(null);
    const [tripList, setTripList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [tripDetails, setTripDetails] = useState(null);

    // Helper: Chuyển đổi định dạng ngày
    const toInputDate = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };

    // Load danh sách chuyến đi
    const loadTrips = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchTrips(1, 0, 999);
            setTripList(response.data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách chuyến đi:", error);
            toast.error("❌ Không thể tải danh sách chuyến đi.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Load chi tiết chuyến đi
    const loadTripDetails = useCallback(async () => {
        if (!selectedTripId) {
            // Reset form nếu không chọn chuyến đi
            setTrip({
                userId: 1,
                id: null,
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                thumbnail: "",
                status: 1,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetchTripDetailsById(selectedTripId);
            const trip = response.data;
            console.log(trip)
            setTripDetails(trip);
            setTrip({
                ...trip,
                startDate: toInputDate(trip.startDate),
                endDate: toInputDate(trip.endDate),
            });
        } catch (error) {
            console.error("Lỗi khi tải chi tiết chuyến đi:", error);
            toast.error("❌ Không thể tải chi tiết chuyến đi.");
        } finally {
            setLoading(false);
        }
    }, [selectedTripId]);

    // Lưu chuyến đi (create hoặc update)
    const saveTrip = useCallback(async (tripForm) => {
        if (!validateTrip(tripForm)) return;
        setLoading(true);
        try {
            let response;

            if (tripForm.id) {
                // Cập nhật
                response = await updateTrip(tripForm.id, tripForm);
                if (!response?.data) throw new Error("API không trả về dữ liệu hợp lệ.");

                // Cập nhật danh sách và trip hiện tại
                setTripList((prev) =>
                    prev.map((t) => (t.id === tripForm.id ? response.data : t))
                );
                handleTripChange(response.data);

                toast.success("✅ Cập nhật chuyến đi thành công!");
            } else {
                // Tạo mới
                response = await createTrip(tripForm);
                if (!response?.data) throw new Error("API không trả về dữ liệu hợp lệ.");

                const newTrip = { ...tripForm, id: response.data.id };
                setTrip(newTrip);
                handleTripChange(newTrip);

                toast.success("✅ Tạo chuyến đi thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi lưu/cập nhật chuyến đi:", error);
            toast.error("❌ Thao tác thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [handleTripChange]);

    // Kiểm tra dữ liệu trước khi lưu hoặc gửi
    const validateTrip = (trip) => {
        if (!trip.title) {
            toast.error("❌ Vui lòng nhập tên chuyến đi.");
            return false;
        }
        if (!trip.startDate || !trip.endDate) {
            toast.error("❌ Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
            return false;
        }
        if (new Date(trip.startDate) > new Date(trip.endDate)) {
            toast.error("❌ Ngày bắt đầu không được sau ngày kết thúc.");
            return false;
        }
        return true;
    };

    // Load danh sách chuyến đi khi component mount
    useEffect(() => {
        loadTrips();
    }, [loadTrips]);

    // Load chi tiết chuyến đi khi `selectedTripId` thay đổi
    useEffect(() => {
        loadTripDetails();
    }, [loadTripDetails]);

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="bg-[#FAF3E0] shadow-xl p-8 rounded-2xl space-y-8 text-vintageBrown col-span-1 md:col-span-3">
                <TripForm saveTrip={saveTrip} />
            </div>
            <div className="bg-[#FAF3E0] shadow-xl p-8 rounded-2xl space-y-8 text-vintageBrown col-span-1 md:col-span-3">
                <LocationForm
                // formLocation={formLocation}
                // setFormLocation={setFormLocation}
                // handleAddLocation={handleAddLocation}
                // handleSaveEdit={handleSaveEdit}
                // resetForm={resetForm}
                // editingIndex={editingIndex}
                />
            </div>



            {/* <TripTree
                tripList={tripList}
                selectedTripId={selectedTripId}
                setSelectedTripId={setSelectedTripId}
                loading={loading}
                onDeleteLocation={onDeleteLocation}
                tripDetails={tripDetails}
            /> */}



        </div>
    );
}
