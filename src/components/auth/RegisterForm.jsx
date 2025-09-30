import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { registerApi } from "../../api/login";
import { toast } from "react-toastify";

export default function RegisterForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerApi(form);

            toast.success("Đăng ký thành công! Hãy đăng nhập.");
            setForm({ email: "", password: "" })
            // navigate("/login");
        } catch (err) {
            setError("Đăng ký thất bại, vui lòng thử lại.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-vintage-pattern">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-yellow-700 text-center">
                {/* Title */}
                <h2 className="text-3xl font-extrabold mb-6 text-yellow-900">
                    Đăng ký
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full mb-4 px-4 py-2 border border-yellow-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mật khẩu"
                        className="w-full mb-4 px-4 py-2 border border-yellow-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />

                    {error && <p className="text-red-600 mb-3">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-2 rounded-md transition-colors"
                    >
                        Đăng ký
                    </button>
                </form>

                {/* Link to login */}
                <p className="mt-6 text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <NavLink
                        to="/login"
                        className="text-yellow-800 font-semibold hover:text-yellow-600 transition-colors"
                    >
                        Đăng nhập ngay
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
