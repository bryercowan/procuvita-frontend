import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { CalendarEvent } from '../types';
import EventModal from './EventModal';
import AddEventModal from './AddEventModal';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onRescheduleEvent: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onAskCoach: (event: CalendarEvent, question: string) => void;
  onUpdateEventDetails: (event: CalendarEvent, newDetails: string) => void;
}

export default function Calendar({ 
  events, 
  onAddEvent, 
  onRescheduleEvent, 
  onAskCoach,
  onUpdateEventDetails 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getEventsForTime = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart.getHours() === hour;
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleTimeClick = (hour: number) => {
    const date = new Date(currentDate);
    date.setHours(hour, 0, 0, 0);
    setSelectedTime(date);
    setShowAddModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Calendar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setView('day')}
            className={`px-3 py-1 rounded-md ${
              view === 'day' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            Day
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-3 py-1 rounded-md ${
              view === 'week' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-y-auto max-h-[600px]">
        <div className="relative min-h-[1440px]"> {/* 24 hours * 60px */}
          {hours.map(hour => (
            <div key={hour} className="absolute w-full" style={{ top: `${hour * 60}px` }}>
              <div className="flex items-start border-t border-gray-200">
                <div className="w-16 pr-2 text-right">
                  <span className="text-xs text-gray-500">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                </div>
                <div className="flex-1 relative min-h-[60px] group">
                  <button 
                    onClick={() => handleTimeClick(hour)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-50/80 transition-opacity"
                  >
                    <Plus className="h-5 w-5 text-gray-400" />
                  </button>
                  {getEventsForTime(hour).map(event => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="absolute left-0 right-0 mx-2 rounded-lg p-2 text-sm cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
                      style={{
                        backgroundColor: event.backgroundColor || '#EEF2FF',
                        top: `${new Date(event.start).getMinutes()}px`,
                        height: `${(new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60)}px`
                      }}
                    >
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(event.start).toLocaleTimeString('en-US', { 
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onReschedule={onRescheduleEvent}
          onAskCoach={onAskCoach}
          onUpdateDetails={onUpdateEventDetails}
        />
      )}

      {/* Add Event Modal */}
      {showAddModal && selectedTime && (
        <AddEventModal
          date={selectedTime}
          onClose={() => setShowAddModal(false)}
          onAdd={onAddEvent}
        />
      )}
    </div>
  );
}