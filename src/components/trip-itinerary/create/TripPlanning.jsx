import React, { useEffect } from 'react'
import DayItinerary from './TripDayItinerary';

export default function TripPlanning({ startDate, endDate, days, colors = [], onAddActivity = null, onEditActivity = null, onDeleteActivity = null }) {
    const [computedDays, setComputedDays] = React.useState([]);

    useEffect(() => {
        if (!startDate || !endDate) {
            setComputedDays([]);
            return;
        }
        const s = new Date(startDate);
        const e = new Date(endDate);
        const diffMs = e - s;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // tính số ngày bao gồm cả ngày bắt đầu và kết thúc
        const daysArr = [];
        for (let i = 0; i < diffDays; i++) {
            const d = new Date(s);
            d.setDate(s.getDate() + i);
            daysArr.push({
                date: d.toLocaleDateString("en-CA"),
                dayIndex: i,
                note: "",
                activities: [] // nhiều hoạt động trong ngày
            });
        }
        setComputedDays(daysArr);
    }, [startDate, endDate]);

    const daysToShow = (Array.isArray(days) && days.length > 0) ? days : computedDays;

    const handleAddActivity = (dayIndex, activity) => {
        // find the day by dayIndex and add activity
        const day = daysToShow.find(d => d.dayIndex === dayIndex);
        return (day && onAddActivity ? onAddActivity(dayIndex, activity) : null);
    };

    const handleEditActivity = (dayIndex, activityIndex, activity) => {
        const day = daysToShow.find(d => d.dayIndex === dayIndex);
        return (day && onEditActivity ? onEditActivity(dayIndex, activityIndex, activity) : null);
    };
    const handleDeleteActivity = (dayIndex, activityIndex) => {
        const day = daysToShow.find(d => d.dayIndex === dayIndex);
        return (day && onDeleteActivity ? onDeleteActivity(dayIndex, activityIndex) : null);
    };

    return (
        <>
            {daysToShow.map((date, idx) => (
                <DayItinerary
                    key={idx}
                    colors={colors}
                    day={{ ...date, dayIndex: date.dayIndex ?? idx }}
                    onDeleteActivity={handleDeleteActivity}
                    onAddActivity={handleAddActivity}
                    onEditActivity={handleEditActivity}
                />
            ))}
        </>
    )
}
