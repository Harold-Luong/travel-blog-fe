
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { loginApi } from "../../../api/login"
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await loginApi(form);
            await login(res);
            navigate(from, { replace: true });
        } catch {
            setError("Tên đăng nhập hoặc mật khẩu không đúng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email đăng nhập"
                className="w-full mb-4 px-4 py-2 border border-yellow-700 rounded-md"
            />
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="w-full mb-4 px-4 py-2 border border-yellow-700 rounded-md"
            />

            {error && (
                <p className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 text-sm text-center">
                    {error}
                </p>
            )}
            <br></br>
            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-yellow-500 text-white py-2 rounded-lg font-medium shadow-md hover:bg-yellow-600 transition disabled:opacity-60"
            >

                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Đang đăng nhập...
                    </>
                ) : (
                    "Đăng nhập"
                )}
            </button>
        </form>
    );
}
