import React, { useState } from 'react';
import icon from '../dashboard-assets/icon.svg';

export default function WeekCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const formatDate = (date) => date.toISOString().split('T')[0];
  const weekDates = getWeekDates(currentDate);
  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-[#BCBCBC] relative">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4 rounded-4xl text-white bg-[#5C0EA4] px-2">
        <button
          onClick={goToPreviousMonth}
          className="bg-white p-2 rounded-full"
        >
          <img src={icon} alt="prev-month" className="w-4 h-4 rotate-180" />
        </button>
        <h2 className="text-white font-medium text-xl py-2.5">{monthLabel}</h2>
        <button
          onClick={goToNextMonth}
          className="bg-white p-2 rounded-full"
        >
          <img src={icon} alt="next-month" className="w-4 h-4" />
        </button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="bg-white p-2 rounded-full"
        >
          <img src={icon} alt="prev-week" className="w-4 h-4 rotate-180" />
        </button>

        <div className="flex-1 px-2">
          {/* Weekday Labels */}
          <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="w-full text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="flex justify-between text-center">
            {weekDates.map((date, i) => {
              const isToday =
                formatDate(date) === formatDate(new Date())
                  ? 'bg-purple-100'
                  : '';
              return (
                <div
                  key={i}
                  className={`w-full py-2 rounded-lg ${isToday} transition-all`}
                >
                  <div className="text-sm font-medium text-gray-800">
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={goToNextWeek}
          className="bg-white p-2 rounded-full"
        >
          <img src={icon} alt="next-week" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}