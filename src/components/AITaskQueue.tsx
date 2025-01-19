import React from 'react';
import { Bot, RotateCcw, CheckCircle } from 'lucide-react';
import type { Task, Agent } from '../types';

interface AITaskQueueProps {
  agents: Agent[];
  onReassignTask: (taskId: string, agentId: string) => void;
}

export default function AITaskQueue({ agents, onReassignTask }: AITaskQueueProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Task Queue</h2>
      
      {agents.map(agent => (
        <div key={agent.id} className="mb-6">
          <div className="flex items-center mb-3">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{agent.name}</h3>
              <p className="text-xs text-gray-500">{agent.specialty}</p>
            </div>
          </div>

          <div className="space-y-3">
            {agent.taskQueue.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onReassignTask(task.id, agent.id)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <RotateCcw className="h-4 w-4 text-gray-500" />
                  </button>
                  {task.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}