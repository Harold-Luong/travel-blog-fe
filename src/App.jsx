import Location from "./components/locations/Location";
import Map from "./components/map/Map";
import Trip from "./components/trip/Trip";
import Home from "./layout/Home";
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Layout from "./layout/Layout";
import TripDetails from "./components/trip/TripDetails";
import Dashboard from "./components/dashboard/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UtilityPage from "./components/utility/UtilityPage";
import MapVietNam from "./components/map/MapVietNam";
import TripSchedulePage from "./components/schedule/TripSchedulePage";
import EditTrip from "./components/dashboard/EditTrip";
import TripItineraryCreate from "./components/trip-itinerary/TripItineraryCreate";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";


function TripDetailsWrapper() {
  const { tripId } = useParams();
  return <TripDetails tripId={tripId} />;
}

function CreateLocationWrapper() {
  const { tripId } = useParams();
  return <CreateLocation tripId={tripId} />;
}

function NotFound() {
  return <div className="p-6">Page not found</div>;
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Layout bọc chung */}
          <Route element={<Layout />}>
            {/* Trang chủ public */}
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* Các trang private */}
            <Route
              path="/trips"
              element={
                <PrivateRoute>
                  <Trip />
                </PrivateRoute>
              }
            />

            <Route
              path="/trips/:tripId"
              element={
                <PrivateRoute>
                  <TripDetailsWrapper />
                </PrivateRoute>
              }
            />
            <Route
              path="/locations"
              element={
                <PrivateRoute>
                  <Location />
                </PrivateRoute>
              }
            />
            <Route
              path="/map"
              element={
                <PrivateRoute>
                  <MapVietNam />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/create"
              element={
                <PrivateRoute>
                  <TripSchedulePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/trip-itinerary"
              element={
                <PrivateRoute>
                  <TripItineraryCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/utility"
              element={
                <PrivateRoute>
                  <UtilityPage />
                </PrivateRoute>
              }
            />

            {/* Trang không tìm thấy */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>

      {/* Toast thông báo */}
      <ToastContainer position="top-right" autoClose={2500} />
    </AuthProvider>
  );
}