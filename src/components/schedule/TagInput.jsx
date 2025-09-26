import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({ value = [], onChange }) {

    const [input, setInput] = useState("");

    const addTag = () => {
        if (input.trim() && !value.includes(input.trim())) {
            onChange([...value, input.trim()]);
            setInput("");
        }
    };

    const removeTag = (tag) => {
        onChange(value.filter((t) => t !== tag));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="p-2  border border-vintageBrown/40 rounded-lg ">
            <div className="flex flex-wrap gap-2 mb-2">
                {value.length > 0 && (
                    value
                        .filter(tag => tag.trim() !== "")
                        .map((tag, idx) => (
                            <span
                                key={idx}
                                className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="text-amber-600 hover:text-amber-800"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))
                )}

            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tag tìm nhanh, nhấn Enter để lưu"
                className="w-full border border-vintageBrown/40 rounded-lg p-2 bg-vintageCream"
            //className="w-full p-2 border rounded"
            />
        </div>
    );
}
