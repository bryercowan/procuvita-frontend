import React from 'react';
import { Trophy, Zap, Calendar } from 'lucide-react';
import type { Goal } from '../types';

interface DailyProgressProps {
  goals: Goal[];
}

export default function DailyProgress({ goals }: DailyProgressProps) {
  const totalXP = goals.reduce((sum, goal) => sum + goal.xp, 0);
  const completedTasks = goals.reduce(
    (sum, goal) => sum + goal.tasks.filter(task => task.completed).length,
    0
  );
  const totalTasks = goals.reduce((sum, goal) => sum + goal.tasks.length, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">Daily Progress</h2>
      
      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Trophy className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Total XP</p>
              <p className="text-2xl font-bold text-indigo-600">{totalXP}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Tasks Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedTasks}/{totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Current Streak</p>
              <p className="text-2xl font-bold text-purple-600">5 days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-900">Today's Schedule</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span className="ml-2 text-sm text-gray-500">9:00 AM - Morning Workout</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="ml-2 text-sm text-gray-500">2:00 PM - TypeScript Course</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span className="ml-2 text-sm text-gray-500">5:00 PM - Meal Prep</span>
          </div>
        </div>
      </div>
    </div>
  );
}