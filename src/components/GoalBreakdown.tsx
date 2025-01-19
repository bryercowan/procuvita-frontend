import React from 'react';
import { ChevronDown, Target, Brain, Calendar } from 'lucide-react';
import type { Goal, Task } from '../types';

interface GoalBreakdownProps {
  goal: Goal;
  onAddMilestone: (goalId: string) => void;
  onAddTask: (goalId: string) => void;
}

export default function GoalBreakdown({ goal, onAddMilestone, onAddTask }: GoalBreakdownProps) {
  const milestones = goal.tasks.filter(task => task.priority === 'high');
  const dailyTasks = goal.tasks.filter(task => task.priority === 'medium' || task.priority === 'low');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">{goal.title}</h2>
        </div>
        <span className="text-sm font-medium text-gray-500">
          Level {goal.level} • {goal.xp} XP
        </span>
      </div>

      {/* Milestones Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
          </div>
          <button
            onClick={() => onAddMilestone(goal.id)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Add Milestone
          </button>
        </div>
        <div className="space-y-4">
          {milestones.map(milestone => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>

      {/* Daily Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Daily Tasks</h3>
          </div>
          <button
            onClick={() => onAddTask(goal.id)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Add Task
          </button>
        </div>
        <div className="space-y-3">
          {dailyTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone }: { milestone: Task }) {
  return (
    <div className="bg-purple-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-purple-900">{milestone.title}</h4>
          {milestone.description && (
            <p className="text-sm text-purple-700 mt-1">{milestone.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-purple-700">+{milestone.xpReward} XP</span>
          <ChevronDown className="h-4 w-4 text-purple-600" />
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
      <div>
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-600">+{task.xpReward} XP</span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          task.priority === 'high' 
            ? 'bg-red-100 text-red-700'
            : task.priority === 'medium'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
}