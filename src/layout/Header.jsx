import { NavLink, useNavigate } from "react-router-dom";
import { PlaneTakeoff, MapPinCheckInside, BookImage, Layers, Map, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const slogans = [
        "Mỗi chuyến đi là một câu chuyện",
        "Khám phá thế giới – Khám phá chính mình",
        "Đi để nhớ – Viết để giữ",
        "Ghi dấu hành trình – Chia sẻ trải nghiệm",
        "Lưu giữ ký ức, kể lại hành trình",
        "Hãy đi đi - Chần chừ - Trời tối mất"
    ];

    const slogan = useMemo(() => {
        const index = Math.floor(Math.random() * slogans.length);
        return slogans[index];
    }, []);

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "flex items-center gap-2 text-yellow-300 font-bold"
            : "flex items-center gap-2 hover:text-blue-400 transition-colors";

    const navigate = useNavigate();
    const { token, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-vintageBrown text-white px-6 py-4 flex justify-between items-center shadow-md">

            {/* Logo + Slogan */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">
                    <NavLink to="/" className={navLinkClass}>
                        My Travel Blog
                    </NavLink>
                </h1>
                <p className="text-md italic font-slogan text-yellow-200 drop-shadow-md">{slogan}</p>
            </div>

            {/* Navigation */}
            <ul className="flex gap-6 text-sm items-center">
                <li>
                    <NavLink to="/trips" className={navLinkClass}>
                        <PlaneTakeoff className="w-5 h-5" />
                        <span className="hidden sm:inline">Trips</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/locations" className={navLinkClass}>
                        <MapPinCheckInside className="w-5 h-5" />
                        <span className="hidden sm:inline">Locations</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/trip-itinerary" className={navLinkClass}>
                        <BookImage className="w-5 h-5" />
                        <span className="hidden sm:inline">Trip itinerary</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/map" className={navLinkClass}>
                        <Map className="w-5 h-5" />
                        <span className="hidden sm:inline">Map</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/utility" className={navLinkClass}>
                        <Layers className="w-5 h-5" />
                        <span className="hidden sm:inline">Utility</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </NavLink>
                </li>
                {!token ? (
                    <li>
                        <NavLink to="/login" className={navLinkClass}>
                            <LogIn className="w-5 h-5" />
                            <span className="hidden sm:inline">Login</span>
                        </NavLink>
                    </li>
                ) : (
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </li>
                )}
            </ul>
        </header>
    );
}