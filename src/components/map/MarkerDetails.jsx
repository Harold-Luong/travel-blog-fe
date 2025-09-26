
export default function MarkerDetails({ loc }) {
    /**
     * Converts date from ISO format (2025-04-03T10:00:00) to format (10:00 03/04/2025)
     * @param {string} visitedAt - ISO date string
     * @returns {string} Formatted date string
     */
    function formatDate(visitedAt) {
        const date = new Date(visitedAt);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
    return (
        <div key={loc.id} className="w-full max-w-4xl bg-white" >
            <div className="flex flex-wrap md:flex-nowrap gap-10 border ">
                {/* Thông tin bên trái */}
                <div className="w-full md:w-2/3 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{loc.name}</h3>
                    <div>
                        <span className="font-semibold">Visited at:</span> {formatDate(loc.visitedAt) || 'Unknown date'}
                    </div>
                    <div>
                        {/* <span className="font-semibold">Address:</span>{' '} */}
                        {loc.street && <span>{loc.street}, </span>}
                        {loc.district && <span>{loc.district}, </span>}
                        {loc.province && <span>{loc.province}, </span>}
                        {loc.country && <span>{loc.country}</span>}
                    </div>
                    <div>
                        {/* <span className="font-semibold">Coordinates:</span>{' '} */}
                        {loc.latitude}, {loc.longitude}
                    </div>
                    <div>
                        <span className="font-semibold">Description:</span> {loc.description || 'No description available'}

                    </div>
                </div>
            </div>
        </div >

    )
}
