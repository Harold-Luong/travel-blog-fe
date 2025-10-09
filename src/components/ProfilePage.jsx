import { useState, useEffect } from "react";
import { User, LogOut, Edit3, Save, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateUserApi } from "../api/login";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        givenName: user?.givenName || "",
        familyName: user?.familyName || "",
        bio: user?.bio || "",
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(user?.picture || null);
    const [loading, setLoading] = useState(false);

    // Update preview when user changes (e.g. after context update)
    useEffect(() => {
        if (user?.avatar) setPreview(user.avatar);
        if (user?.givenName || user?.familyName || user?.bio) {
            setForm({
                givenName: user.givenName || "",
                familyName: user.familyName || "",
                bio: user.bio || "",
            });
        }
    }, [user]);

    // Lock scroll when loading overlay is active
    useEffect(() => {
        if (loading) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [loading]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
            // revoke later when component unmounts or avatar changes (handled by browser GC but we can keep it simple)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Nếu đang ở chế độ xem thì chuyển sang chế độ chỉnh sửa
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append(
                "data",
                new Blob([JSON.stringify(form)], { type: "application/json" })
            );
            if (avatar) formData.append("avatar", avatar);

            const res = await updateUserApi(formData);
            updateUser(res); // cập nhật vào context
            setAvatar(null);

            // Cập nhật preview nếu server trả avatar mới
            if (res?.avatar || res?.picture) {
                setPreview(res.avatar || res.picture);
            }

            toast.success("Cập nhật thành công!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Overlay toàn màn hình khi loading */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg">
                        <Loader2 className="animate-spin" size={36} />
                        <span className="text-yellow-700 font-medium">Đang lưu thay đổi...</span>
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
                <form
                    onSubmit={handleSubmit}
                    className="relative bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-10 border border-yellow-100"
                >
                    {/* Cột trái - Avatar */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="avatar"
                                    className="w-32 h-32 rounded-full border-4 border-yellow-500 object-cover shadow-lg transition-transform duration-200 hover:scale-105"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-yellow-500 flex items-center justify-center bg-gray-50 shadow-lg">
                                    <User className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-yellow-500 text-white p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    <Edit3 size={16} />
                                </label>
                            )}
                        </div>

                        <h2 className="text-2xl font-semibold text-yellow-800">
                            {form.familyName} {form.givenName}
                        </h2>
                        <p className="text-gray-500 text-sm">{user?.email}</p>

                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-2 mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 transition"
                        >
                            <LogOut size={16} /> Đăng xuất
                        </button>
                    </div>

                    {/* Cột phải - Form */}
                    <div className="md:col-span-2 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            {/* Tên */}
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-gray-700 font-medium text-right">Tên:</label>
                                {isEditing ? (
                                    <input
                                        name="givenName"
                                        value={form.givenName}
                                        onChange={handleChange}
                                        className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                ) : (
                                    <p className="flex-1 text-gray-800">{form.givenName || ""}</p>
                                )}
                            </div>

                            {/* Họ */}
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-gray-700 font-medium text-right">Họ:</label>
                                {isEditing ? (
                                    <input
                                        name="familyName"
                                        value={form.familyName}
                                        onChange={handleChange}
                                        className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                ) : (
                                    <p className="flex-1 text-gray-800">{form.familyName || ""}</p>
                                )}
                            </div>

                            {/* Giới thiệu */}
                            <div className="flex items-start gap-4">
                                <label className="w-32 text-gray-700 font-medium text-right">Giới thiệu:</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                                    />
                                ) : (
                                    <p className="flex-1 text-gray-800 whitespace-pre-line">{form.bio || ""}</p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-lg font-medium shadow-md hover:bg-yellow-600 transition disabled:opacity-60"
                            >
                                {isEditing ? (
                                    loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} /> Lưu thay đổi
                                        </>
                                    )
                                ) : (
                                    <>
                                        <Edit3 size={18} /> Chỉnh sửa
                                    </>
                                )}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white py-2 rounded-lg font-medium shadow-md hover:bg-gray-500 transition"
                                >
                                    <X size={18} /> Hủy
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
