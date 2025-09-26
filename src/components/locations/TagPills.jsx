// components/TagPills.jsx
export default function TagPills({ allTags, selected, onChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            {allTags.map((t) => {
                const isActive = selected === t;
                return (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => onChange(isActive ? null : t)}
                        className={`px-3 py-1 rounded-full text-sm transition ${isActive
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {t.name}
                    </button>
                );
            })}
        </div>
    );
}
