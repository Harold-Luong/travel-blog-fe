import { useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = (response) => {
        try {
            const decoded = jwtDecode(response.credential);
            const data = {
                accessToken: response.credential,
                user: {
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture,
                    family_name: decoded.family_name,
                    given_name: decoded.given_name,
                    email_verified: decoded.email_verified
                },
                expiresAt: decoded.exp * 1000,
            };

            login(data);

            navigate(from, { replace: true });
        } catch (err) {
            console.error("Decode error:", err);
        }
    };

    const handleError = () => {
        console.log("Google Login Failed");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-vintage-pattern">
            <div className="bg-white p-8 rounded-xl shadow-md w-96 border border-yellow-800 text-center">
                <h2 className="text-2xl font-bold mb-6 text-yellow-900">
                    Đăng nhập
                </h2>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin onSuccess={handleGoogleLogin} onError={handleError} />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
}
