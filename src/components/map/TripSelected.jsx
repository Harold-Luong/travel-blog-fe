export default function TripSelected({ tripList = [], onSelected }) {
    return (
        <div className="mb-6 border-b">
            <select
                className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
                onChange={(e) => {
                    const selectedId = e.target.value;
                    const trip = tripList.find((t) => String(t.id) === selectedId);
                    onSelected?.(trip);
                }}
            >
                <option value='0'>-- Chọn chuyến đi --</option>
                {tripList.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                        {trip.title}
                    </option>
                ))}
            </select>
        </div>
    );
}
