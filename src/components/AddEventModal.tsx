import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import type { CalendarEvent } from '../types';
import AITextEditor from './AITextEditor';
import { calculateEventXP, getXPBreakdown } from '../utils/xpCalculator';

interface AddEventModalProps {
  date: Date;
  onClose: () => void;
  onAdd: (event: Omit<CalendarEvent, 'id'>) => void;
}

export default function AddEventModal({ date, onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState(
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [endTime, setEndTime] = useState(
    new Date(date.getTime() + 60 * 60 * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    })
  );
  const [details, setDetails] = useState('');

  const categories = [
    { value: 'Health', color: '#EEF2FF' },
    { value: 'Career', color: '#F0FDF4' },
    { value: 'Learning', color: '#FEF3C7' },
    { value: 'Personal', color: '#FCE7F3' },
    { value: 'Finance', color: '#ECFDF5' }
  ];

  // Calculate potential XP based on current form values
  const calculatePotentialXP = () => {
    if (!title || !category || !startTime || !endTime) return null;

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date(date);
    startDate.setHours(startHours, startMinutes);

    const endDate = new Date(date);
    endDate.setHours(endHours, endMinutes);

    const eventData = {
      title,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      category,
      details
    };

    return getXPBreakdown(eventData);
  };

  const xpBreakdown = calculatePotentialXP();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date(date);
    startDate.setHours(startHours, startMinutes);

    const endDate = new Date(date);
    endDate.setHours(endHours, endMinutes);

    const selectedCategory = categories.find(c => c.value === category);

    onAdd({
      title,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      category,
      backgroundColor: selectedCategory?.color || '#EEF2FF',
      details
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Event</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.value}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <AITextEditor
              value={details}
              onChange={setDetails}
              placeholder="Add event details, notes, or a plan..."
              minHeight="150px"
            />
          </div>

          {/* XP Breakdown */}
          {xpBreakdown && (
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="font-medium text-indigo-900">Potential XP Reward</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base XP (time-based)</span>
                  <span className="font-medium text-indigo-600">+{xpBreakdown.base}</span>
                </div>
                {xpBreakdown.categoryBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category Bonus ({category})</span>
                    <span className="font-medium text-indigo-600">+{xpBreakdown.categoryBonus}</span>
                  </div>
                )}
                {xpBreakdown.structureBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Structure Bonus</span>
                    <span className="font-medium text-indigo-600">+{xpBreakdown.structureBonus}</span>
                  </div>
                )}
                {xpBreakdown.stepBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Step Bonus</span>
                    <span className="font-medium text-indigo-600">+{xpBreakdown.stepBonus}</span>
                  </div>
                )}
                {xpBreakdown.patternBonuses.map(({ name, bonus }) => (
                  <div key={name} className="flex justify-between">
                    <span className="text-gray-600">{name.charAt(0).toUpperCase() + name.slice(1)} Bonus</span>
                    <span className="font-medium text-indigo-600">+{bonus}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-indigo-100">
                  <div className="flex justify-between font-medium">
                    <span className="text-indigo-900">Total XP</span>
                    <span className="text-indigo-600">{xpBreakdown.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}