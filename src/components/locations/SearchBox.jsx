import { Search, X } from "lucide-react";

export default function SearchBox({ search, setSearch }) {
    return (
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white shadow-sm">
            <Search className="w-4 h-4 text-gray-500" />

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên, mô tả, địa chỉ..."
                className="bg-transparent outline-none text-sm w-64"
            />

            {search && (
                <button
                    onClick={() => setSearch("")}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
