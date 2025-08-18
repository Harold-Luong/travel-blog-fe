import React, { useState } from "react";
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
    "Người biết đủ mới là người giàu có thật sự."
];

export default function RandomThought() {
    const [current, setCurrent] = useState(() =>
        thoughts[Math.floor(Math.random() * thoughts.length)]
    );

    const getRandomThought = () => {
        let next;
        do {
            next = thoughts[Math.floor(Math.random() * thoughts.length)];
        } while (next === current); // tránh trùng câu ngay
        setCurrent(next);
    };

    return (
        <Card className="p-2 relative">
            <CardContent>
                <button
                    onClick={getRandomThought}
                    className="absolute top-3 right-3 p- rounded-full hover:bg-gray-200 transition"
                    title="Đổi câu triết lý"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>

                <div className="text-lg italic text-gray-700 text-center px-6">
                    “{current}”
                </div>
            </CardContent>
        </Card>
    );
}
