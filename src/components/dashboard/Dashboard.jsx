import { useEffect, useState } from "react";
import { Card, CardContent } from "../common/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, MapPin, Tags, Images, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";

export default function Dashboard() {
    const [stats, setStats] = useState({ trips: 0, locations: 0, tags: 0, images: 0 });
    const [tripsChart, setTripsChart] = useState([]);
    const [recentTrips, setRecentTrips] = useState([]);

    useEffect(() => {
        // Fake data (có thể thay bằng fetch API)
        setStats({ trips: 9, locations: 63, tags: 12, images: 210 });
        setTripsChart([
            { month: "1", trips: 1 },
            { month: "2", trips: 0 },
            { month: "3", trips: 2 },
            { month: "4", trips: 0 },
            { month: "5", trips: 3 },
            { month: "6", trips: 1 },
            { month: "7", trips: 5 },
            { month: "8", trips: 2 },
            { month: "9", trips: 0 },
            { month: "10", trips: 4 },
            { month: "11", trips: 1 },
            { month: "12", trips: 3 },
        ]);
        setRecentTrips([
            { id: 1, title: "Chuyến đi Sapa", date: "2025-07-12", cover: "/img/sapa.jpg" },
            { id: 2, title: "Khám phá Huế", date: "2025-06-20", cover: "/img/hue.jpg" },
            { id: 3, title: "Phú Quốc biển xanh", date: "2025-05-02", cover: "/img/phuquoc.jpg" },
        ]);
    }, []);

    return (
        <div className="space-y-6">
            <Breadcrumb />
            <h2 className="text-2xl font-bold">Dashboard</h2>
            {/* Quick Actions */}
            <Card className="p-6 shadow-md rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/trips/create"
                        className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg shadow hover:bg-amber-700 transition">
                        <Plus size={18} />
                        Lên lịch cho chuyến đi mới
                    </Link>
                    <Link
                        to="/location/create"
                        className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg shadow hover:bg-amber-700 transition">
                        <Plus size={18} />
                        Thêm hoặc cập nhật địa điểm của chuyến đi
                    </Link>
                    <Link
                        to="/trips/create"
                        className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg shadow hover:bg-amber-700 transition">
                        <Plus size={18} />
                        Thêm ảnh cho địa điểm
                    </Link>
                    <Link
                        to="/trips/create"
                        className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg shadow hover:bg-amber-700 transition">
                        <Plus size={18} />
                        Tạo thêm thẻ
                    </Link>
                </div>
            </Card>
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-4 flex items-center gap-4 shadow-md rounded-2xl">
                    <Plane className="w-8 h-8 text-blue-500" />
                    <CardContent>
                        <p className="text-sm text-gray-500">Trips</p>
                        <p className="text-xl font-bold">{stats.trips}</p>
                    </CardContent>
                </Card>

                <Card className="p-4 flex items-center gap-4 shadow-md rounded-2xl">
                    <MapPin className="w-8 h-8 text-green-500" />
                    <CardContent>
                        <p className="text-sm text-gray-500">Locations</p>
                        <p className="text-xl font-bold">{stats.locations}</p>
                    </CardContent>
                </Card>

                <Card className="p-4 flex items-center gap-4 shadow-md rounded-2xl">
                    <Tags className="w-8 h-8 text-purple-500" />
                    <CardContent>
                        <p className="text-sm text-gray-500">Tags</p>
                        <p className="text-xl font-bold">{stats.tags}</p>
                    </CardContent>
                </Card>

                <Card className="p-4 flex items-center gap-4 shadow-md rounded-2xl">
                    <Images className="w-8 h-8 text-pink-500" />
                    <CardContent>
                        <p className="text-sm text-gray-500">Images</p>
                        <p className="text-xl font-bold">{stats.images}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="p-6 shadow-md rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Trips theo tháng</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tripsChart}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="trips" fill="#82ca9d" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Recent Trips */}
            <Card className="p-6 shadow-md rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Trip gần đây</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentTrips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition">
                            <img src={trip.cover} alt={trip.title} className="w-full h-32 object-cover rounded-t-2xl" />
                            <div className="p-4">
                                <p className="font-semibold">{trip.title}</p>
                                <p className="text-sm text-gray-500">{trip.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>


        </div>
    );
}
