import { SaveAllIcon, ChevronLeft } from "lucide-react";

export default function Acction({ type, prevStep, handleFinish, handleSubmit }) {
    return (
        <>
            {type === 0 && (
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-amber-700 text-white px-6 py-2 rounded-lg shadow hover:bg-amber-800 transition"
                    >
                        Tiếp tục →
                    </button>
                </div>
            )}
            {type === 1 && (
                <div className="flex justify-end lg:col-span-5">
                    <button
                        onClick={prevStep}
                        className="flex items-center gap-2 px-4 py-2 bg-vintageCream border border-vintageBrown/30 rounded-lg hover:bg-vintageBrown/20">
                        <ChevronLeft size={16} /> Quay lại
                    </button>
                    <button
                        onClick={handleFinish}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800">
                        <SaveAllIcon size={16} /> Tạo chuyến đi
                    </button>
                </div>
            )}
        </>
    );
}