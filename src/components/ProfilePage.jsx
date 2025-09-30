import { LogOutIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-6 rounded shadow-md text-center">
                    <h2 className="text-xl font-bold text-red-600">Bạn chưa đăng nhập</h2>
                    <p className="text-gray-600 mt-2">
                        Vui lòng đăng nhập bằng Google để xem thông tin cá nhân.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-left justify-lefy min-h-screen  from-yellow-100 to-yellow-200">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <img
                        src={user.picture}
                        alt="avatar"
                        className="w-24 h-24 rounded-full border-4 border-yellow-500 shadow-md"
                    />

                    {/* Name */}
                    <h2 className="mt-4 text-2xl font-bold text-yellow-800">
                        {user.name}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>

                {/* Thông tin chi tiết */}
                <div className="mt-6 space-y-2 text-gray-700">
                    <p>
                        <span className="font-semibold">Given Name:</span>{" "}
                        {user.given_name || "-"}
                    </p>
                    <p>
                        <span className="font-semibold">Family Name:</span>{" "}
                        {user.family_name || "-"}
                    </p>
                    <p>
                        <span className="font-semibold">Email Verified:</span>{" "}
                        {user.email_verified ? "✅ Yes" : "❌ No"}
                    </p>

                    <button
                        onClick={logout}
                        className="mt-4 w-full bg-vintageBrown text-white py-2 rounded-lg font-medium shadow-md hover:opacity-90 transition"
                    >

                        <span className="hidden sm:inline">Đăng xuất</span>
                    </button>

                </div>
            </div>
        </div>
    );
}
