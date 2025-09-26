import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import TripCreate from "./TripCreate";
import LocationsCreate from "./LocationsCreate";

export default function TripSchedulePage() {
    const [step, setStep] = useState(0);
    const [trip, setTrip] = useState(null);

    const handleTripChange = (e) => {
        setTrip(e);
        nextStep();
    };

    const nextStep = () => setStep(1);
    const prevStep = () => setStep(0);

    return (
        <div className="space-y-6">
            <Breadcrumb items={[{ label: "Dashboard", path: "/dashboard" }, { label: "Create Trip" }]} />
            <div className="grid grid-cols-12 gap-6 min-h-screen">
                <div className="col-span-12">

                    <TripCreate handleTripChange={handleTripChange} nextStep={nextStep} />

                    <LocationsCreate trip={trip} prevStep={prevStep} />
                </div>
            </div>
        </div>
    );
}
