import React, { useState } from 'react';
import { X, Clock, MessageSquare, Edit2, Check } from 'lucide-react';
import type { CalendarEvent } from '../types';
import AITextEditor from './AITextEditor';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onReschedule: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onAskCoach: (event: CalendarEvent, question: string) => void;
  onUpdateDetails: (event: CalendarEvent, newDetails: string) => void;
}

export default function EventModal({ event, onClose, onReschedule, onAskCoach, onUpdateDetails }: EventModalProps) {
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editedDetails, setEditedDetails] = useState(event.details || '');

  const handleSaveDetails = () => {
    onUpdateDetails(event, editedDetails);
    setIsEditingDetails(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Time */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>
              {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
            </span>
          </div>

          {/* Event Details */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Details</h3>
              {!isEditingDetails ? (
                <button
                  onClick={() => setIsEditingDetails(true)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Edit2 className="h-4 w-4 text-gray-500" />
                </button>
              ) : (
                <button
                  onClick={handleSaveDetails}
                  className="p-1 hover:bg-green-100 rounded-full text-green-600"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              {isEditingDetails ? (
                <AITextEditor
                  value={editedDetails}
                  onChange={setEditedDetails}
                />
              ) : (
                <div className="text-gray-600 whitespace-pre-wrap font-mono text-sm leading-relaxed bg-gray-50 rounded-md p-3 min-h-[200px]">
                  {event.details || 'No details added yet.'}
                </div>
              )}
            </div>
          </div>

          {/* Ask Coach */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Ask Coach</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask a question about this event..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}