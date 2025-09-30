import { NavLink } from "react-router-dom";
import { Layers, LogInIcon, Map, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {

    const { user, isAuthenticated } = useAuth();
    const [imgError, setImgError] = useState(false);

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

    return (
        <header className="bg-vintageBrown text-white px-6 py-4 flex justify-between items-center shadow-md">
            {/* Logo + Slogan */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">
                    <NavLink to="/" className={navLinkClass}>
                        My Travel Blog
                    </NavLink>
                </h1>
                <p className="text-md italic font-slogan text-yellow-200 drop-shadow-md">
                    {slogan}
                </p>
            </div>

            {/* Navigation */}
            <ul className="flex gap-6 text-sm items-center">
                <li>
                    <NavLink to="/map" className={navLinkClass}>
                        <Map className="w-5 h-5" />
                        <span className="hidden sm:inline">Bản đồ</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/utility" className={navLinkClass}>
                        <Layers className="w-5 h-5" />
                        <span className="hidden sm:inline">Tiện ích</span>
                    </NavLink>
                </li>

                {!isAuthenticated ? (
                    <li>
                        <NavLink to="/login" className={navLinkClass}>
                            <LogInIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Đăng nhập</span>
                        </NavLink>
                    </li>
                ) : (
                    <li >
                        <NavLink to="/profile" className={navLinkClass}>
                            {!imgError && user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full border border-white shadow object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <User className="w-8 h-8 rounded-full border border-white shadow object-cover" />
                            )}
                        </NavLink>
                    </li>
                )}
            </ul>
        </header>
    );
}
