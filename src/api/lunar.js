// lunar.js
// Chuyển lịch dương (Gregorian) -> âm (Lunar) (múi giờ có thể truyền, mặc định Asia/Ho_Chi_Minh = 7)
// Không phụ thuộc thư viện ngoài.
// Author: assistant (adapted common astronomical algorithm)

const PI = Math.PI;

/** Julian day number from date (Gregorian) */
export function jdFromDate(dd, mm, yy) {
    // dd, mm (1-12), yy (e.g. 2025)
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd =
        dd +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045;
    // if date is before Gregorian adoption (optional) - not needed for modern dates
    return jd;
}

/** Convert Julian day number to date (Gregorian) */
export function jdToDate(jd) {
    let Z = jd;
    let A;
    if (Z < 2299161) {
        A = Z;
    } else {
        const alpha = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - Math.floor(alpha / 4);
    }
    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);
    const day = B - D - Math.floor(30.6001 * E);
    let month = E < 14 ? E - 1 : E - 13;
    let year = month > 2 ? C - 4716 : C - 4715;
    return { day, month, year };
}

/** Compute the day (integer JDN) of the k-th new moon.
 * timeZone in hours (e.g. 7)
 */
export function getNewMoonDay(k, timeZone) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = PI / 180;
    let Jd1 =
        2415020.75933 +
        29.53058868 * k +
        0.0001178 * T2 -
        0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

    let C1 =
        (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
        0.0021 * Math.sin(2 * M * dr) -
        0.4068 * Math.sin(Mpr * dr) +
        0.0161 * Math.sin(2 * Mpr * dr) -
        0.0004 * Math.sin(3 * Mpr * dr) +
        0.0104 * Math.sin(2 * F * dr) -
        0.0051 * Math.sin((M + Mpr) * dr) -
        0.0074 * Math.sin((M - Mpr) * dr) +
        0.0004 * Math.sin((2 * F + M) * dr) -
        0.0004 * Math.sin((2 * F - M) * dr) -
        0.0006 * Math.sin((2 * F + Mpr) * dr) +
        0.0010 * Math.sin((2 * F - Mpr) * dr) +
        0.0005 * Math.sin((2 * Mpr + M) * dr);

    let delta;
    if (T < -11) {
        delta =
            0.001 +
            0.000839 * T +
            0.0002261 * T2 -
            0.00000845 * T3 -
            0.000000081 * T * T3;
    } else {
        delta = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }

    const JdNew = Jd1 + C1 - delta;
    // return (integer) day number in local time zone
    return Math.floor(JdNew + 0.5 + timeZone / 24.0);
}

/** Sun longitude at given JDN (0..11) each representing 30 degree sectors */
export function getSunLongitude(jdn, timeZone) {
    const T = (jdn - 2451545.0 - timeZone / 24) / 36525;
    const T2 = T * T;
    const dr = PI / 180;
    // mean anomaly, mean longitude
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    const DL =
        (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) +
        0.000290 * Math.sin(3 * M * dr);
    let L = L0 + DL;
    L *= dr;
    // normalize
    L = L - 2 * PI * Math.floor(L / (2 * PI));
    // return integer 0..11
    return Math.floor((L / PI) * 6);
}

/** Find the lunar month 11 (the month contain the winter solstice) of year yy */
export function getLunarMonth11(yy, timeZone) {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    const sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
}

/** Determine leap month offset (how many months after a11 the leap month occurs) */
export function getLeapMonthOffset(a11, timeZone) {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
}

/**
 * Convert solar date dd/mm/yy to lunar date
 * Returns object: { lunarDay, lunarMonth, lunarYear, isLeap }
 * timeZone default 7 (Asia/Ho_Chi_Minh)
 */
export function convertSolar2Lunar(dd, mm, yy, timeZone = 7) {
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }

    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
    }

    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let lunarMonth = diff + 11;
    let isLeap = false;

    // leap month
    if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff) {
                isLeap = true;
            }
        }
    }

    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

    return {
        lunarDay,
        lunarMonth,
        lunarYear,
        isLeap,
    };
}

/** Convenience: accept JS Date object */
export function solarDateToLunar(date, timeZone = 7) {
    return convertSolar2Lunar(date.getDate(), date.getMonth() + 1, date.getFullYear(), timeZone);
}

/** Utility: format lunar date as dd/MM (with leading zeros) */
export function formatLunar(lunar) {
    const dd = String(lunar.lunarDay).padStart(2, "0");
    const mm = String(lunar.lunarMonth).padStart(2, "0");
    return `${dd}/${mm}${lunar.isLeap ? ' (Nhuận)' : ''}`;
}

/** Check if given solar date is one of the 10 vegetarian days (by lunar day) */
export function isVegetarianDayByLunar(date, timeZone = 7) {
    const lunar = solarDateToLunar(date, timeZone);
    const veg = [1, 8, 14, 15, 18, 23, 24, 28, 29, 30];
    return veg.includes(lunar.lunarDay);
}

/* Example usage (uncomment to test)
console.log(convertSolar2Lunar(27,8,2025,7)); // {lunarDay, lunarMonth, lunarYear, isLeap}
console.log(formatLunar(convertSolar2Lunar(27,8,2025,7)));
console.log(solarDateToLunar(new Date()));
console.log(isVegetarianDayByLunar(new Date()));
*/
