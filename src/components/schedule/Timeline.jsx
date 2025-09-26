import { CheckCircle2, Circle } from "lucide-react";

/**
 * props:
 * - steps: [{ key, title }]
 * - currentStep: number
 * - onStepClick?: (idx:number) => void   // optional
 */
export default function Timeline({ steps = [], currentStep = 0, onStepClick }) {
    const total = Array.isArray(steps) ? steps.length : 0;
    const clamped = Math.max(0, Math.min(currentStep, Math.max(0, total - 1)));
    const progress = total > 1 ? (clamped / (total - 1)) * 100 : 0;

    return (
        <div className="relative w-full">
            {/* Track (đường nền) */}
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200" />
            {/* Progress (đã hoàn thành) */}
            <div
                className="absolute left-0 top-4 h-0.5 bg-amber-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
            />

            <ol className="relative z-10 flex items-start justify-between">
                {steps.map((s, idx) => {
                    const state = idx < clamped ? "done" : idx === clamped ? "current" : "todo";
                    return (
                        <li key={s.key ?? idx} className="flex-1 px-2">
                            <button
                                type="button"
                                onClick={onStepClick ? () => onStepClick(idx) : undefined}
                                className="group flex flex-col items-center text-center w-full cursor-default"
                            >
                                {/* Marker */}
                                <span
                                    className={[
                                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition",
                                        state === "done"
                                            ? "bg-green-500 border-green-500 text-white"
                                            : state === "current"
                                                ? "bg-white border-amber-600 ring-4 ring-amber-100 text-amber-600"
                                                : "bg-white border-gray-300 text-gray-400",
                                    ].join(" ")}
                                >
                                    {state === "done" ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Circle className="w-5 h-5" />
                                    )}
                                </span>

                                {/* Tiêu đề */}
                                <div
                                    className={[
                                        "mt-2 text-sm font-semibold",
                                        state === "current" ? "text-amber-700" : "text-gray-700",
                                    ].join(" ")}
                                >
                                    {s.title}
                                </div>

                                {/* Trạng thái */}
                                {state === "current" && (
                                    <div className="text-xs text-gray-500 mt-1">Đang thực hiện…</div>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
