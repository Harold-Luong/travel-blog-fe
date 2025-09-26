import Breadcrumb from "../common/Breadcrumb";
import MiniCalendar from "./MiniCalendar";
import Calendar from "./Calendar";
import QuickNoteEditor from "./QuickNoteEditor";
import Weather from "./Weather";
import PriceCoin from "./price-coin/PriceCoin";
import RandomAnyThing from "./RandomAnyThing";
import BMICalculator from "./BMICalculator";
import RandomThought from "./RandomThought";
import CalculatePercent from "./CalculatePercent";
import CountDays from "./CountDays";

export default function UtilityPage() {
    return (
        <div className="space-y-6">
            <Breadcrumb items={[{
                "label": "Bảng tiện ích",
                "path": "/utility"
            }]} />
            <h2 className="text-2xl font-bold">Bảng tiện ích</h2>
            <div className="max-w-7xl mx-auto space-y-4">
                <RandomThought />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left big column */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MiniCalendar />
                            <Weather />
                        </div>
                        {/* Calendar + controls */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Calendar />
                            <QuickNoteEditor />
                        </div>
                        {/* Extra utilities row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BMICalculator />
                            <RandomAnyThing />
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-4 space-y-4">
                        <PriceCoin />
                        <CountDays />
                        <CalculatePercent />
                    </div>
                </div>
            </div>
        </div>
    );
}
