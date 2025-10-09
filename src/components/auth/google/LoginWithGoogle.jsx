
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginGoogle } from "../../../api/login"
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginWithGoogle() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = async (response) => {
        const body = {
            idToken: response.credential
        };
        try {
            const res = await loginGoogle(body);
            await login(res);

            navigate(from, { replace: true })

        } catch (err) {
            console.error("Decode error:", err);
        }
    };

    const handleError = () => {
        console.log("Google Login Failed");
    };
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleError}
                theme="outline"
                size="large"
                shape="rectangular"
                text="signin_with"
            />
        </GoogleOAuthProvider>
    )
}
