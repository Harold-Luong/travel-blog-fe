export default function generateDistinctColors(count) {
    const colors = [];
    const minHueDiff = 20; // khoảng cách tối thiểu giữa các hue (sẽ giới hạn số lượng màu khác nhau), tối đa 14 màu với minHueDiff = 20
    const baseSaturation = 70;
    const baseLightness = 55;

    function hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
    }

    function rgbToHex(r, g, b) {
        return (
            "#" +
            [r, g, b]
                .map(x => x.toString(16).padStart(2, "0"))
                .join("")
        );
    }

    function getBrightness(r, g, b) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function isHueTooClose(h1, h2) {
        const diff = Math.abs(h1 - h2);
        return Math.min(diff, 360 - diff) < minHueDiff;
    }

    let tries = 0;
    while (colors.length < count && tries < 2000) {
        let hue = Math.floor(Math.random() * 360);
        let tooClose = colors.some(c => isHueTooClose(c.hue, hue));
        if (tooClose) {
            tries++;
            continue;
        }

        let saturation = baseSaturation + (Math.random() * 20 - 5);
        let lightness = baseLightness + (Math.random() * 20 - 15);

        let [r, g, b] = hslToRgb(hue, saturation, lightness);
        let brightness = getBrightness(r, g, b);

        // loại bỏ màu quá tối hoặc quá sáng
        if (brightness < 80 || brightness > 240) {
            tries++;
            continue;
        }

        colors.push({ hue, hex: rgbToHex(r, g, b) });
    }

    return colors.map(c => c.hex);
}
