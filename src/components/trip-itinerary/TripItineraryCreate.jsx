import React, { useState } from "react";

// Trip form component
function TripForm({ tripForm, setTripForm }) {
    return (
        <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-amber-200">
            <h2 className="text-lg font-bold text-amber-700">Trip Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input
                        type="text"
                        value={tripForm.title}
                        onChange={(e) => setTripForm({ ...tripForm, title: e.target.value })}
                        className="w-full border rounded-lg p-2 bg-[#FFFDF6]"
                        placeholder="Trip to Da Nang"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Thumbnail</label>
                    <input
                        type="text"
                        value={tripForm.thumbnail}
                        onChange={(e) =>
                            setTripForm({ ...tripForm, thumbnail: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 bg-[#FFFDF6]"
                        placeholder="Image URL"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Start Date</label>
                    <input
                        type="date"
                        value={tripForm.startDate}
                        onChange={(e) =>
                            setTripForm({ ...tripForm, startDate: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 bg-[#FFFDF6]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">End Date</label>
                    <input
                        type="date"
                        value={tripForm.endDate}
                        onChange={(e) =>
                            setTripForm({ ...tripForm, endDate: e.target.value })
                        }
                        className="w-full border rounded-lg p-2 bg-[#FFFDF6]"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                    value={tripForm.description}
                    onChange={(e) =>
                        setTripForm({ ...tripForm, description: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 bg-[#FFFDF6]"
                    rows={3}
                />
            </div>
        </div>
    );
}

// Location card per day
function DayItinerary({ dayIndex, activities, onAddActivity }) {
    return (
        <div className="flex border rounded-lg overflow-hidden shadow bg-orange-50">
            {/* DAY label */}
            <div className="bg-orange-200 text-white font-bold text-lg flex items-center justify-center px-4 py-6 writing-mode-vertical">
                DAY {dayIndex + 1}
            </div>

            {/* Activities list */}
            <div className="flex-1 p-4">
                <div className="grid grid-cols-2 font-semibold border-b pb-2 mb-2 text-sm text-gray-700">
                    <span>Time</span>
                    <span>Activity</span>
                </div>
                <div className="space-y-2">
                    {activities.map((act, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-2 border-b border-dotted border-gray-300 pb-1"
                        >
                            <span className="text-gray-600">{act.time}</span>
                            <span className="text-gray-800">{act.desc}</span>
                        </div>
                    ))}
                    <button
                        onClick={() => onAddActivity(dayIndex)}
                        className="mt-2 px-3 py-1 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                        + Add Activity
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main screen
export default function TripItineraryCreate() {
    const [tripForm, setTripForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        thumbnail: "",
    });

    const [itinerary, setItinerary] = useState([]);

    const handleAddActivity = (dayIndex) => {
        const time = prompt("Enter time (e.g. 09:00 AM)");
        const desc = prompt("Enter activity description");
        if (time && desc) {
            setItinerary((prev) =>
                prev.map((day, idx) =>
                    idx === dayIndex
                        ? { ...day, activities: [...day.activities, { time, desc }] }
                        : day
                )
            );
        }
    };

    return (
        <div className="p-6 space-y-6">
            <TripForm tripForm={tripForm} setTripForm={setTripForm} />

            <h2 className="text-lg font-bold text-amber-700">Itinerary</h2>
            <div className="space-y-6">
                {itinerary.map((day, idx) => (
                    <DayItinerary
                        key={idx}
                        dayIndex={idx}
                        activities={day.activities}
                        onAddActivity={handleAddActivity} />
                ))}
            </div>
        </div>
    );
}
