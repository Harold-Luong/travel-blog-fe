
import { useState, useEffect, useMemo } from "react";
import { fetchLocations } from "../../api/location"; // Assuming you have a fetchLocations function in
import Pagination from "../common/Pagination"; // Adjust the import path as necessary
import LocationCard from "./LocationCard";
import { Search, X, Loader2, ArrowUpDown } from "lucide-react";
import TagList from "../common/TagList";
import Breadcrumb from "../common/Breadcrumb";
export default function Location() {
    const size = 8;
    const userId = 1;

    const [allLocations, setAllLocations] = useState([]); // dữ liệu gốc

    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("all");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("visitedAt_desc");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(0);

    // Fetch 1 lần toàn bộ data theo userId
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetchLocations(userId, 0, 100); // lấy nhiều rồi xử lý client
                const data = response.data || [];
                setTotalElements(response.totalElements || 0);
                setAllLocations(data);

                // build tags
                const uniqueTags = new Map(data.flatMap(loc => loc.tags || []).map(tag => [tag.id, tag]));
                const tagsWithAll = [{ id: "all", name: "All" }, ...uniqueTags.values()];

                setTags(tagsWithAll);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Xử lý filter, search, sort
    const processedLocations = useMemo(() => {
        let result = [...allLocations];

        // filter theo tag
        if (selectedTag !== "all") {
            result = result.filter(loc => loc.tags?.some(t => t.id === selectedTag));
        }

        // search
        if (search.trim()) {
            const lower = search.toLowerCase();
            result = result.filter(
                loc =>
                    loc.name.toLowerCase().includes(lower) ||
                    loc.description?.toLowerCase().includes(lower) ||
                    loc.street?.toLowerCase().includes(lower) ||
                    loc.district?.toLowerCase().includes(lower) ||
                    loc.province?.toLowerCase().includes(lower) ||
                    loc.country?.toLowerCase().includes(lower)
            );
        }

        // sort
        switch (sort) {
            case "visitedAt_asc":
                result.sort((a, b) => new Date(a.visitedAt) - new Date(b.visitedAt));
                break;
            case "visitedAt_desc":
                result.sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));
                break;
            case "name_asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name_desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        // phân trang
        const start = page * size;
        const end = start + size;
        const paginated = result.slice(start, end);

        return {
            data: paginated,
            totalPages: Math.ceil(result.length / size)
        };
    }, [allLocations, selectedTag, search, sort, page, size]);

    const handleClickTag = (tag) => {
        setSelectedTag(tag.id); // gán tag đang chọn
        setPage(0); // reset page khi đổi tag
    };

    return (
        <div className="space-y-6">
            <Breadcrumb />
            <h2 className="text-2xl font-bold">Tất cả địa điểm đã đi qua</h2>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold"></h1>
                        <p className="text-sm opacity-80">Tổng cộng: {totalElements} địa điểm</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 shadow-sm">
                            <Search className="w-4 h-4 text-gray-500" />
                            <input
                                value={search}
                                onChange={(e) => { setPage(0); setSearch(e.target.value); }}
                                placeholder="Tìm tên, mô tả, địa chỉ..."
                                className="bg-transparent outline-none text-sm w-64"
                            />
                            {search && (
                                <button onClick={() => setSearch("")}> <X className="w-4 h-4" /> </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 shadow-sm">
                            <ArrowUpDown className="w-4 h-4" />
                            <select
                                className="bg-transparent text-sm outline-none"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="visitedAt_desc">Mới nhất</option>
                                <option value="visitedAt_asc">Cũ nhất</option>
                                <option value="name_asc">Tên (A→Z)</option>
                                <option value="name_desc">Tên (Z→A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                    <TagList tags={tags} onClick={handleClickTag} selectedTag={selectedTag} />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-white animate-pulse">
                                <div className="aspect-[4/3] bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : processedLocations.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mb-3" />
                        <p className="text-lg font-semibold">Không tìm thấy địa điểm nào</p>
                        <p className="text-sm opacity-70">Thử xoá bộ lọc hoặc tìm với từ khoá khác.</p>
                        <button
                            className="mt-4 px-4 py-2 rounded-lg bg-vintageBrown text-white hover:opacity-90"
                            onClick={() => { setSearch(""); setTags([]); setSort("visitedAt_desc"); }}
                        >
                            Xoá bộ lọc
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {processedLocations.data.map((loc) => (
                                <LocationCard key={loc.id} loc={loc} onClick={handleClickTag} selectedTag={selectedTag} />
                            ))}
                        </div>
                        <Pagination page={page} totalPages={processedLocations.totalPages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
}