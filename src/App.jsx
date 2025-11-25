import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Layout from "./layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UtilityPage from "./components/utility/UtilityPage";
import MapVietNam from "./components/map/MapVietNam";
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/profile/ProfilePage';
import ProtectedRoute from "./components/ProtectedRoute"
import RegisterForm from './components/auth/RegisterForm';
import TripItineraryPage from './components/trip-itinerary/create/TripItineraryPage';
import MyTripList from './components/trip-itinerary/get/list/MyTripList';
import MyTripDetails from './components/trip-itinerary/get/detail/MyTripDetails';

function NotFound() {
  return <div className="p-6">Page not found</div>;
}
function TripDetailsWrapper() {
  const { slug } = useParams();
  return <MyTripDetails slug={slug} />;
}


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Layout bọc chung */}
          <Route element={<Layout />}>
            <Route
              path="/my-trip"
              element={<ProtectedRoute> <MyTripList /></ProtectedRoute>}
            />
            <Route
              path="/trip-itinerary"
              element={<ProtectedRoute> <TripItineraryPage /></ProtectedRoute>}
            />
            <Route
              path="/trip/:slug"
              element={
                <ProtectedRoute>
                  <TripDetailsWrapper />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/register"
              element={<RegisterForm />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}