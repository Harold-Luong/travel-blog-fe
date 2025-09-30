import { NavLink } from "react-router-dom";
import LoginForm from "./base-jwt/LoginForm";
import LoginWithGoogle from "./google/LoginWithGoogle";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-vintage-pattern">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-yellow-700">

                {/* Title */}
                <h2 className="text-3xl font-extrabold mb-6 text-yellow-900 text-center">
                    Đăng nhập
                </h2>

                {/* Login form */}
                <LoginForm />

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">hoặc</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                {/* Google login */}
                <LoginWithGoogle />


                {/* Register link */}
                <p className="mt-6 text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <NavLink
                        to="/register"
                        className="text-yellow-800 font-semibold hover:text-yellow-600 transition-colors"
                    >
                        Đăng ký ngay
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
