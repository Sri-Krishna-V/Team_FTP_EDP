import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Sample events data
  const events: Event[] = [
    {
      id: 1,
      title: "Innovation Summit",
      date: new Date(2025, 0, 15),
      location: "Virtual",
      description: "Annual innovation summit featuring industry leaders and emerging technologies."
    },
    {
      id: 2,
      title: "Startup Pitch Day",
      date: new Date(2025, 0, 22),
      location: "Tech Hub, Building 3",
      description: "Pitch your startup idea to a panel of investors and industry experts."
    },
    {
      id: 3,
      title: "AI Workshop",
      date: new Date(2025, 1, 5),
      location: "Conference Room A",
      description: "Hands-on workshop on implementing AI solutions for business problems."
    },
    {
      id: 4,
      title: "Networking Mixer",
      date: new Date(2025, 1, 18),
      location: "Rooftop Lounge",
      description: "Connect with entrepreneurs, investors, and industry professionals."
    }
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 p-1"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event => 
        event.date.getDate() === day && 
        event.date.getMonth() === month && 
        event.date.getFullYear() === year
      );
      
      days.push(
        <div key={day} className="h-24 border border-gray-200 p-1 overflow-hidden">
          <div className="font-medium">{day}</div>
          {dayEvents.map(event => (
            <div key={event.id} className="text-xs p-1 mt-1 bg-orange-100 text-orange-800 rounded truncate">
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center bg-orange-500 text-white p-4">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-white/20">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold">{monthName} {year}</h2>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-white/20">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 bg-orange-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2 font-medium text-orange-800">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {days}
        </div>
        
        <div className="p-4 border-t">
          <h3 className="font-bold text-lg mb-2">Upcoming Events</h3>
          {events
            .filter(event => event.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 3)
            .map(event => (
              <div key={event.id} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">
                  {event.date.toLocaleDateString()} • {event.location}
                </div>
                <p className="text-sm mt-1">{event.description}</p>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return renderCalendar();
};

export default Calendar;