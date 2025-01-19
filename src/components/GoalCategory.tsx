import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Goal } from '../types';
import AIFeedback from './AIFeedback';

interface GoalCategoryProps {
  goal: Goal;
}

export default function GoalCategory({ goal }: GoalCategoryProps) {
  const [expanded, setExpanded] = useState(false);
  const xpPercentage = (goal.xp % 1000) / 10;

  // Simulated AI feedback data
  const feedback = {
    message: "You're making steady progress towards your goal. I notice you've been consistent with your daily tasks, which is excellent. However, there's room for improvement in reaching your key milestones.",
    suggestions: [
      "Consider breaking down the next milestone into smaller, more manageable tasks",
      "Schedule focused work blocks for high-priority tasks",
      "Document your progress more regularly to track patterns"
    ],
    adjustments: [
      {
        type: 'increase' as const,
        metric: 'Task completion rate',
        reason: 'Current pace is slightly below target'
      },
      {
        type: 'decrease' as const,
        metric: 'Time between milestones',
        reason: 'Faster progression needed to meet goal timeline'
      }
    ],
    progress: [
      {
        metric: 'Tasks Completed',
        current: 8,
        target: 12,
        trend: 'up' as const
      },
      {
        metric: 'Milestone Progress',
        current: 2,
        target: 5,
        trend: 'stable' as const
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-sm transition-all hover:shadow-md">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <img
              src={goal.agent.avatarUrl}
              alt={goal.agent.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{goal.category}</h2>
              <p className="text-sm text-gray-500">{goal.agent.name} - {goal.agent.personality} Guide</p>
            </div>
          </div>
          <div className="text-right flex items-center space-x-4">
            <div>
              <span className="text-sm font-medium text-gray-900">Level {goal.level}</span>
              <div className="mt-1 h-2 w-32 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{goal.xp} XP</span>
            </div>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-900">{goal.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{goal.description}</p>
        </div>

        <div className="mt-4 space-y-3">
          {goal.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="flex items-center">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="ml-2 text-sm text-gray-700">{task.title}</span>
              </div>
              <span className="text-xs font-medium text-gray-500">+{task.xpReward} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Feedback Section */}
      {expanded && (
        <div className="border-t">
          <AIFeedback 
            agent={goal.agent}
            goal={goal}
            feedback={feedback}
          />
        </div>
      )}
    </div>
  );
}