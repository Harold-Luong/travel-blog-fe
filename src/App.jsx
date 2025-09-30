import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UtilityPage from "./components/utility/UtilityPage";
import MapVietNam from "./components/map/MapVietNam";
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from "./components/ProtectedRoute"
function NotFound() {
  return <div className="p-6">Page not found</div>;
}

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Layout bọc chung */}
          <Route element={<Layout />}>
            <Route
              path="/map"
              element={<ProtectedRoute> <MapVietNam /></ProtectedRoute>}
            />
            <Route
              path="/utility"
              element={<ProtectedRoute> <UtilityPage /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute> <ProfilePage /></ProtectedRoute>}
            />
            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}