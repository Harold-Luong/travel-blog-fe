import { useState } from "react";
import { X, EarthIcon } from "lucide-react";
import MapCommon from "../../map/MapCommon";

export default function RightDrawerMapReview({
    days = [],
    colors = [],

}) {
    const [open, setOpen] = useState(false);
    const sizeWidth = 620;

    const handleToggleMap = () => {
        const newState = !open;
        setOpen(newState);
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none ">
            {/* Drawer panel (có thể tương tác được) */}
            <div
                className=" border-2 p-2 border-current absolute top-0 right-0 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out pointer-events-auto"
                style={{
                    width: `${sizeWidth}px`,
                    transform: `translateX(${open ? 0 : sizeWidth}px)`,
                    overflow: "hidden",
                }}
            >
                <div className="flex-1">
                    <MapCommon days={days} colors={colors} />
                </div>
            </div>

            <button
                onClick={handleToggleMap}
                title={open ? "Ẩn bản đồ" : "Xem trên bản đồ"}
                className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-300 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 pointer-events-auto`}
                style={{
                    zIndex: 60,
                    right: open ? `${sizeWidth}px` : "0",
                }}
            >
                {open ? (
                    <X className="w-6 h-6 text-red-700" />
                ) : (
                    <EarthIcon className="w-6 h-6 text-green-700" />
                )}
            </button>
        </div>
    );
}
