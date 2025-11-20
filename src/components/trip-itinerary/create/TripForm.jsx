
export default function TripForm({ tripRequest, setTripRequest }) {
    const handleChange = (key, value) => {
        setTripRequest({ ...tripRequest, [key]: value });
    };

    return (
        <div className="bg-white shadow-md rounded-2xl p-4 border border-amber-200/60 hover:shadow-lg transition-shadow duration-300 h-[435px]">
            <h2 className=" text-xl font-semibold text-amber-700 mb-4 ">
                <div className="inline">Thông tin chuyến đi</div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Tên hành trình</label>
                    <input
                        type="text"
                        value={tripRequest.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="input-field"
                        placeholder="Hành trình trên đất phù sa"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex flex-col pt-2">
                            <label className="text-sm font-medium text-gray-700 mb-1">Ngày đi</label>
                            <input
                                type="date"
                                value={tripRequest.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="flex flex-col pt-2">
                            <label className="text-sm font-medium text-gray-700 mb-1">Ngày về</label>
                            <input
                                type="date"
                                value={tripRequest.endDate}
                                onChange={(e) => handleChange("endDate", e.target.value)}
                                className="input-field"
                            />
                        </div>

                    </div>

                    <div className="flex flex-col pt-2">
                        <label className="text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            value={tripRequest.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            className="input-field"
                        >
                            <option value="PLANNING">Đang lên kế hoạch</option>
                            <option value="ONGOING">Đang diễn ra</option>
                            <option value="COMPLETED">Đã hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                        </select>
                    </div>
                    <div className="flex flex-col pt-2">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả về chuyến đi</label>
                        <textarea
                            value={tripRequest.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="input-field min-h-[100px] resize-y"
                            placeholder="Tuổi trẻ, hãy sống hết mình với đam mê ..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
