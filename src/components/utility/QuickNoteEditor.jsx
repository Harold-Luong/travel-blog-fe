import { useState, useEffect } from "react";
import { Card, CardContent } from "../common/Card";
import { MinusCircle } from "lucide-react";

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
        <Card className="p-4">
            <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">Ghi chú nhanh</div>
                        <div className="font-semibold">Notes</div>
                    </div>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Ghi chú nhanh..."
                        className="flex-1 border p-2 rounded"
                    />
                    <button
                        onClick={() => {
                            addNote(text);
                            setText("");
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                        Add
                    </button>
                </div>

                {/* Notes list */}
                <div className="mt-3 space-y-2  overflow-y-auto">
                    {notes.map((n) => (
                        <div key={n.id} className="flex items-center justify-between gap-2 group">
                            <div className="p-2 border rounded bg-gray-50 text-sm flex-1">{n.text}</div>
                            <button
                                onClick={() => removeNote(n.id)}
                                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition">
                                <MinusCircle size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
