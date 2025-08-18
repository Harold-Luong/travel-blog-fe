import Breadcrumb from "../common/Breadcrumb";
import Clock from "./Clock";
import Calendar from "./Calendar";
import QuickNoteEditor from "./QuickNoteEditor";
import Weather from "./Weather";
import PriceCoin from "./PriceCoin";
import RandomAnyThing from "./RandomAnyThing";
import ExchangeCurrency from "./ExchangeCurrency";
import BMICalculator from "./BMICalculator";
import RandomThought from "./RandomThought";
import Shortcuts from "./Shortcuts";
import CalculatePercent from "./CalculatePercent";

export default function UtilityPage() {
    return (
        <div className="space-y-6">
            <Breadcrumb />
            <h2 className="text-2xl font-bold">Bảng tiện ích</h2>
            <div className="max-w-7xl mx-auto space-y-4">
                <RandomThought />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left big column */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Clock />
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
                        <CalculatePercent />
                        <ExchangeCurrency />
                        <Shortcuts />
                    </div>
                </div>
            </div>
        </div>
    );
}
