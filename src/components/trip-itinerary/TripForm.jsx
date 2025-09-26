import React from "react";

export default function TripForm({ trip, onChange }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 border">
            <h2 className="text-lg font-semibold mb-3">Trip Information</h2>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-sm text-gray-600">Title</label>
                    <input
                        type="text"
                        value={trip.title}
                        onChange={(e) => onChange("title", e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Thumbnail URL</label>
                    <input
                        type="text"
                        value={trip.thumbnail}
                        onChange={(e) => onChange("thumbnail", e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                        type="date"
                        value={trip.startDate}
                        onChange={(e) => onChange("startDate", e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">End Date</label>
                    <input
                        type="date"
                        value={trip.endDate}
                        onChange={(e) => onChange("endDate", e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                    />
                </div>
            </div>
            <div className="mt-3">
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                    value={trip.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    className="w-full border rounded-md px-2 py-1 text-sm"
                    rows={2}
                />
            </div>
        </div>
    );
}
