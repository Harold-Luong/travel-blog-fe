import { useState, useEffect } from "react";
import { Card, CardContent } from "../common/Card";
import { MinusCircle, PlusCircleIcon } from "lucide-react";

// -------------------- Sub components --------------------
export default function QuickNoteEditor() {
    const [text, setText] = useState("");

    // Quick notes
    const [notes, setNotes] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("utility_notes_v1") || "[]");
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("utility_notes_v1", JSON.stringify(notes));
    }, [notes]);

    const addNote = (text) => {
        if (!text.trim()) return;
        setNotes((prev) => [{ id: Date.now(), text }, ...prev]);
    };

    const removeNote = (id) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <Card>
            <CardContent>
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">Ghi chú nhanh</div>
                        <div className="font-semibold text-lg">Notes</div>
                    </div>
                </div>

                {/* Input */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Viết ghi chú..."
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => {
                            addNote(text);
                            setText("");
                        }}
                        className="p-2  bg-vintageBrown text-vintageCream text-white rounded-lg hover:opacity-90 transition"
                    >
                        <PlusCircleIcon size={20} />
                    </button>
                </div>

                {/* Notes list */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notes.map((n) => (
                        <div
                            key={n.id}
                            className="flex items-center justify-between gap-2 group bg-gray-50 border rounded-lg p-2 hover:bg-gray-100 transition"
                        >
                            <div className="text-sm flex-1">{n.text}</div>
                            <button
                                onClick={() => removeNote(n.id)}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                            >
                                <MinusCircle size={18} />
                            </button>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="text-sm text-gray-400 italic text-center py-4">
                            Chưa có ghi chú nào
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
