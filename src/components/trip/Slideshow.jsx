import { useState } from "react";

export default function Slideshow({ photos }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full max-w-2xl h-48 overflow-hidden rounded-xl shadow-lg mx-auto">
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {photos.map((item, i) => (
                    <div key={i} className="w-full h-full flex-shrink-0 relative">
                        {/* Ảnh */}
                        <img
                            src={item.imageUrl}
                            alt={item.description}
                            className="w-full h-full object-cover transition-opacity duration-700"
                        />
                    </div>
                ))}
            </div>

            {/* Description chỉ hiển thị của ảnh hiện tại */}
            <div className="absolute bottom-0 left-0 w-full 
                bg-gradient-to-t from-black/70 via-black/30 to-transparent 
                text-white text-[10px] p-1 backdrop-blur-sm">
                <p className="text-[10px]">{photos[currentIndex].description}</p>
            </div>

            {/* Nút trái */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"
            >
                ◀
            </button>

            {/* Nút phải */}
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"
            >
                ▶
            </button>

            {/* Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-3 h-1 rounded-full transition transform hover:scale-125 ${currentIndex === i ? "bg-white" : "bg-gray-400"}`}
                    ></button>

                ))}
            </div>
        </div>
    );
}
