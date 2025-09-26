export default function Pagination({ page, totalPages, onPageChange }) {
    const getPages = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else {
            // Nếu đang ở trang đầu hoặc gần đầu
            if (page <= 2) {
                for (let i = 0; i <= 2; i++) {
                    pages.push(i);
                }
                pages.push("end-ellipsis");
                pages.push(totalPages - 1);
            }
            // Nếu đang ở trang cuối hoặc gần cuối
            else if (page >= totalPages - 2) {
                pages.push(0);
                pages.push("start-ellipsis");
                for (let i = totalPages - 3; i < totalPages; i++) {
                    pages.push(i);
                }
            }

            // Các trường hợp ở giữa
            else {
                pages.push(0);
                pages.push('start-ellipsis');
                pages.push(page - 1, page, page + 1);
                pages.push('end-ellipsis');
                pages.push(totalPages - 1);
            }
        }
        return pages;
    };

    return (
        <div className="flex justify-between mt-6 items-center">
            <button
                onClick={() => onPageChange(page - 1)}
                className="bg-vintageBrown text-white px-4 py-2 rounded hover:bg-vintageBrownDark"
                disabled={page === 0}
            >
                Previous
            </button>

            <div className="flex gap-2 mx-2">
                {getPages().map((p, idx) =>
                    typeof p === "number" ? (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`px-3 py-1 rounded ${page === p
                                ? "bg-vintageBrown text-white"
                                : "bg-white text-vintageBrown border"
                                }`}
                        >
                            {p + 1}
                        </button>
                    ) : (
                        <span key={p + idx} className="px-3 py-1 text-gray-500 select-none">...</span>
                    )
                )}
            </div>

            <button
                onClick={() => onPageChange(page + 1)}
                className="bg-vintageBrown text-white px-4 py-2 rounded hover:bg-vintageBrownDark"
                disabled={page >= (totalPages || 1) - 1}
            >
                Next
            </button>
        </div>
    );
}
