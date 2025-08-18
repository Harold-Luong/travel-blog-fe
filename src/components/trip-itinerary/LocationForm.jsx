import React from "react";

export default function LocationForm({ location }) {
    return (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-md shadow-sm">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <input
                        type="text"
                        value={location.name}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <input
                        type="text"
                        value={location.address}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Description</label>
                    <textarea
                        value={location.description}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );
}
