import { useEffect, useState } from 'react';
import { fetchTripDetailsById } from '../../api/trip';
import Slideshow from './Slideshow';
import Pagination from '../common/Pagination';
import TagList from '../common/TagList';
import { Link } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";

export default function TripDetails({ tripId }) {
    const size = 3; // Số lượng địa điểm hiển thị mỗi trang
    const [tripDetails, setTripDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    //all tag
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("all");
    const [locations, setLocations] = useState({
        data: [],
        totalPages: 0,
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetchTripDetailsById(tripId);
                const trip = response.data || [];

                const sortedLocations = (trip.locations || []).slice().sort((a, b) => {
                    const dateA = new Date(a.visitedAt);
                    const dateB = new Date(b.visitedAt);

                    const timeA = dateA ? dateA.getTime() : 0;
                    const timeB = dateB ? dateB.getTime() : 0;

                    return timeB - timeA; // giảm dần
                });
                const uniqueTags = new Map(sortedLocations.flatMap(loc => loc.tags || []).map(tag => [tag.id, tag]));
                const tagsWithAll = [{ id: "all", name: "All" }, ...uniqueTags.values()];
                setTags(tagsWithAll)

                setTripDetails(trip);
                setLocations({
                    data: sortedLocations,
                    totalPages: Math.ceil(sortedLocations.length / size),
                });

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [tripId]);

    // Lọc location theo tag
    const filterLocationsByTag = (tag, locations, size) => {
        if (tag.id === "all") {
            return {
                data: locations,
                totalPages: Math.ceil(locations.length / size),
            };
        }
        const filtered = locations.filter(
            loc => loc.tags && loc.tags.some(t => t.id === tag.id)
        );
        return {
            data: filtered,
            totalPages: Math.ceil(filtered.length / size),
        };
    };


    const handleClickTag = (tag) => {
        setSelectedTag(tag.id); // gán tag đang chọn
        const result = filterLocationsByTag(tag, tripDetails.locations, size);
        setLocations(result);
        setPage(0);
    };

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error loading trip details.</div>;
    // if (!tripDetails) return <div>No trip details available.</div>;

    return (
        <div className="bg-white p-6 rounded shadow-md" >
            <Breadcrumb
                items={[
                    { label: "Trips", path: "/trips" },
                    { label: "Trip Details" }
                ]}
            />
            <div className="mb-4 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">{tripDetails.title}</h1>
                <p className="text-gray-700 mb-2">{tripDetails.description}</p>
                <div className="text-sm text-gray-500">
                    <span>Start Date: {tripDetails.startDate}</span>
                    <span className="mx-2">|</span>
                    <span>End Date: {tripDetails.endDate}</span>
                    <span className="mx-2">|</span>
                    <span>Created At: {tripDetails.createdAt}</span>
                    <span className="mx-2">|</span>
                    <span>Updated At: {tripDetails.updatedAt}</span>
                </div>

            </div>
            {
                locations.data && locations.data.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-semibold mt-6 mb-4">Đã ghé thăm {tripDetails.locations.length} địa điểm trong chuyến đi này</h2>
                        {tags.length > 0 && <TagList tags={tags} onClick={handleClickTag} selectedTag={selectedTag} />}
                        <br></br>
                        {locations.data.slice(page * size, (page + 1) * size).map((loc, idx) => (
                            <div key={loc.id || idx} className="mb-6 border-b pb-4">
                                <div className="flex flex-wrap md:flex-nowrap gap-10 border p-4 rounded shadow">
                                    {/* Thông tin bên trái */}
                                    <div className="w-full md:w-2/3 flex flex-col">
                                        <h3 className="text-xl font-semibold mb-2">{loc.name}</h3>
                                        <div className="text-sm text-gray-500 mb-2">
                                            <span className="font-semibold">Visited at:</span> {loc.visitedAt || 'Unknown date'}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Address:</span>{' '}
                                            {loc.street && <span>{loc.street}, </span>}
                                            {loc.district && <span>{loc.district}, </span>}
                                            {loc.province && <span>{loc.province}, </span>}
                                            {loc.country && <span>{loc.country}</span>}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Coordinates:</span>{' '}
                                            {loc.latitude}, {loc.longitude}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Description:</span> {loc.description || 'No description available'}

                                        </div>
                                        {loc.tags && loc.tags.length > 0 && <TagList tags={loc.tags} onClick={handleClickTag} selectedTag={selectedTag} />}
                                        <div className="mt-2">
                                            <Link to={`/locations/${loc.id}`} className="text-blue-500 hover:underline">
                                                View Location Details
                                            </Link>
                                        </div>

                                    </div>
                                    {/* Slideshow bên phải */}
                                    {loc.imageSummaries && loc.imageSummaries.length > 0 && (
                                        <div className="w-full md:w-1/3 flex flex-col items-end justify-end md:items-end md:justify-center">
                                            <Slideshow photos={loc.imageSummaries} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Pagination
                            page={page}
                            totalPages={locations.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                ) : (
                    <div>
                        <span>Chưa thêm địa điểm cho chuyến đi này, </span>
                        <Link to={`/location/create/${tripId}`} className="text-blue-500 hover:underline">
                            thêm địa điểm
                        </Link>
                    </div>
                )
            }
        </div >
    );
}
