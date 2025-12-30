"use client";

import React from 'react';

export function CalendarView({ events = [] }) {
  // Get current date info
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    const dayDate = new Date(currentYear, currentMonth, day);
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-grey-200">
      {/* Calendar Header */}
      <div className="p-4 border-b border-grey-200">
        <h3 className="text-lg font-semibold text-grey-900">
          {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-grey-200">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-grey-500 border-r border-grey-100 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = day === today;
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-1 border-r border-b border-grey-100 last:border-r-0 ${
                !day ? 'bg-grey-50' : ''
              }`}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-grey-900'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                        title={event.summary}
                      >
                        {event.summary}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-grey-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}