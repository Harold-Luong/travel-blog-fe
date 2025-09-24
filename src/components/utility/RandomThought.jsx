import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../common/Card";
import { RefreshCcw } from "lucide-react";

const thoughts = [
    "Cuộc sống giống như đi xe đạp, muốn giữ thăng bằng phải tiếp tục di chuyển.",
    "Không ai có thể quay ngược thời gian, nhưng ai cũng có thể bắt đầu lại từ hôm nay.",
    "Hạnh phúc không nằm ở đích đến, mà nằm trên hành trình.",
    "Sự thay đổi là điều duy nhất không thay đổi.",
    "Người mạnh mẽ không phải là người không bao giờ gục ngã, mà là người luôn đứng dậy sau mỗi lần vấp ngã.",
    "Thời gian là tài sản quý giá nhất, mất đi không thể lấy lại.",
    "Đừng so sánh bản thân với người khác, hãy so sánh với chính mình của ngày hôm qua.",
    "Tâm an thì vạn sự an.",
    "Một suy nghĩ tích cực có thể thay đổi cả một ngày tồi tệ.",
    "Im lặng đôi khi là câu trả lời mạnh mẽ nhất.",
    "Tri thức là sức mạnh, nhưng trí tuệ là biết khi nào nên dùng nó.",
    "Người biết đủ mới là người giàu có thật sự.",
    "Thất bại chỉ là cơ hội để bắt đầu lại một cách thông minh hơn.",
    "Đường tuy xa nhưng cứ đi sẽ đến.",
    "Kỷ luật là cây cầu nối giữa mục tiêu và thành công.",
    "Đừng đợi cơ hội, hãy tạo ra cơ hội.",
    "Một ngọn nến không mất gì khi thắp sáng cho ngọn nến khác.",
    "Người khôn ngoan học được nhiều từ một câu hỏi hơn kẻ ngu dốt học từ một câu trả lời.",
    "Bạn là trung bình của 5 người mà bạn dành nhiều thời gian nhất.",
    "Biết lắng nghe là cách nhanh nhất để trưởng thành.",
    "Giàu có nhất không phải là nhiều tiền, mà là ít mong cầu.",
    "Nếu muốn đi nhanh hãy đi một mình, nếu muốn đi xa hãy đi cùng nhau.",
    "Thành công không phải là đích đến cuối cùng, thất bại cũng không phải là vực sâu, mà là sự can đảm để tiếp tục.",
    "Điều quan trọng không phải là bạn sống bao lâu, mà là bạn đã sống sâu sắc như thế nào.",
    "Một tâm hồn đẹp sẽ tỏa sáng ngay cả khi dung nhan phai tàn."
];

export default function RandomThought() {
    const [current, setCurrent] = useState(() =>
        thoughts[Math.floor(Math.random() * thoughts.length)]
    );
    const [key, setKey] = useState(0); // để reset progress animation

    const getRandomThought = () => {
        let next;
        do {
            next = thoughts[Math.floor(Math.random() * thoughts.length)];
        } while (next === current);
        setCurrent(next);
        setKey((prev) => prev + 1); // reset progress bar
    };

    // Auto random mỗi 60s
    useEffect(() => {
        const timer = setInterval(getRandomThought, 60000);
        return () => clearInterval(timer);
    }, [current]);

    return (
        <Card className=" relative shadow-md">
            <CardContent>
                <button
                    onClick={getRandomThought}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition"
                    title="Đổi câu triết lý"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>

                <div className="text-lg italic text-gray-700 text-center px-6 transition-all duration-500">
                    “{current}”
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-0.5 rounded mt-4 overflow-hidden">
                    <div
                        key={key} // reset animation khi đổi
                        className="h-1 bg-gradient-to-r from-vintageBrown to-orange-400 animate-progress"
                    ></div>
                </div>
            </CardContent>
        </Card>
    );
}
