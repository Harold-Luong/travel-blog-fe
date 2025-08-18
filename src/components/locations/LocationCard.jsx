
import { Link } from "react-router-dom";
import TagList from "../common/TagList";
import { ImageOff, MapPin } from "lucide-react";
export default function LocationCard({ loc, selectedTag = [], onClick }) {
    const img = loc.images?.[0]?.imageUrl || null;

    // format date 2025-08-20 09:10:50.484136 to HH:mm dd/MM/yyyy
    const fmtDate = (date, pattern = "HH:mm dd-MM-yyyy") => {
        if (!date) return "";

        // Nếu date là string thì convert về Date
        const d = typeof date === "string" ? new Date(date) : date;

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");

        if (pattern === "dd/MM/yyyy") return `${day}/${month}/${year}`;
        if (pattern === "yyyy-MM-dd") return `${year}-${month}-${day}`;
        if (pattern === "HH:mm dd/MM/yyyy") return `${hours}:${minutes} ${day}/${month}/${year}`;
        if (pattern === "HH:mm dd-MM-yyyy") return `${hours}:${minutes} ${year}-${month}-${day}`;

        // fallback ISO

        return d.toISOString().slice(0, 10);
    };

    return (
        <div className="rounded-2xl overflow-hidden shadow-md bg-white text-vintageBrown flex flex-col">
            <div className="relative w-full aspect-[4/3] bg-vintageCream overflow-hidden rounded-lg">
                {img ? (
                    <img
                        src={img}
                        alt={loc.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-8 h-8 opacity-50" />
                    </div>
                )}

                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    {fmtDate(loc.visitedAt)}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="text-lg font-semibold line-clamp-1">{loc.name}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{loc.description || "Không có mô tả"}</p>
                <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span className="line-clamp-1">{!loc ? "" :
                        [loc.street, loc.district, loc.province, loc.country]
                            .filter(Boolean) // bỏ null/undefined
                            .join(", ") || "—"}</span>
                </div>
                {loc.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        <TagList tags={loc.tags} onClick={onClick} selectedTag={selectedTag} />
                    </div>
                )}
            </div>
            <div className="px-4 pb-4">
                {/* <Link to={`/locations/${loc.id}`} className="text-vintageBrown hover:underline">View Details</Link> */}
            </div>
        </div>
    );
}