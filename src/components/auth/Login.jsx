
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../api/login"

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginApi(form);
            login(res);
            navigate("/");
        } catch (err) {
            setError("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-vintage-pattern">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-96 border border-yellow-800">

                <h2 className="text-2xl font-bold text-center mb-6 text-yellow-900">
                    Đăng nhập
                </h2>
                <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Tên đăng nhập"
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
                {error && <p className="text-red-600 mb-3">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-2 rounded-md">
                    Đăng nhập
                </button>
            </form>
        </div>
    );

}
