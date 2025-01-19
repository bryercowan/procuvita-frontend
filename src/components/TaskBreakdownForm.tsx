import React, { useState, useEffect } from 'react';
import { X, Brain, Target, Plus, Trash2, Edit2 } from 'lucide-react';
import type { Goal, Task } from '../types';

interface TaskBreakdownFormProps {
  goal: Partial<Goal>;
  onSubmit: (breakdown: {
    tasks: Task[];
    milestones: Task[];
    metrics: Array<{
      name: string;
      target: string;
      frequency: string;
    }>;
  }) => void;
  onBack: () => void;
}

export default function TaskBreakdownForm({ goal, onSubmit, onBack }: TaskBreakdownFormProps) {
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Array<{
    id: string;
    title: string;
    xpReward: number;
    editable?: boolean;
  }>>([]);
  const [tasks, setTasks] = useState<Array<{
    id: string;
    title: string;
    xpReward: number;
    editable?: boolean;
  }>>([]);
  const [metrics, setMetrics] = useState<Array<{
    id: string;
    name: string;
    target: string;
    frequency: string;
    editable?: boolean;
  }>>([]);

  useEffect(() => {
    // Simulate AI generating initial breakdown
    setTimeout(() => {
      // Fake data for "Get a promotion" goal
      setMilestones([
        { id: '1', title: 'Complete key project ahead of schedule', xpReward: 500 },
        { id: '2', title: 'Acquire new technical certification', xpReward: 750 },
        { id: '3', title: 'Lead cross-functional team initiative', xpReward: 1000 }
      ]);

      setTasks([
        { id: '1', title: 'Update skills assessment document', xpReward: 100 },
        { id: '2', title: 'Schedule monthly 1:1s with manager', xpReward: 50 },
        { id: '3', title: 'Document project successes weekly', xpReward: 75 },
        { id: '4', title: 'Network with senior team members', xpReward: 100 }
      ]);

      setMetrics([
        { 
          id: '1',
          name: 'Projects completed ahead of schedule',
          target: '3',
          frequency: 'quarterly'
        },
        {
          id: '2',
          name: 'Team members mentored',
          target: '2',
          frequency: 'monthly'
        },
        {
          id: '3',
          name: 'New skills/certifications acquired',
          target: '2',
          frequency: 'yearly'
        }
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const handleEditMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => 
      m.id === id ? { ...m, editable: true } : m
    ));
  };

  const handleSaveMilestone = (id: string, newTitle: string) => {
    setMilestones(prev => prev.map(m => 
      m.id === id ? { ...m, title: newTitle, editable: false } : m
    ));
  };

  const handleEditTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, editable: true } : t
    ));
  };

  const handleSaveTask = (id: string, newTitle: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, title: newTitle, editable: false } : t
    ));
  };

  const handleEditMetric = (id: string) => {
    setMetrics(prev => prev.map(m => 
      m.id === id ? { ...m, editable: true } : m
    ));
  };

  const handleSaveMetric = (id: string, updates: Partial<typeof metrics[0]>) => {
    setMetrics(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates, editable: false } : m
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI-Generated Breakdown</h2>
        <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to Analysis
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-indigo-600 animate-pulse" />
            <span className="text-gray-600">Analyzing and breaking down your goal...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Key Milestones */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Key Milestones</h3>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center space-x-3">
                  <div className="flex-1 bg-indigo-50 rounded-lg p-3">
                    {milestone.editable ? (
                      <input
                        type="text"
                        defaultValue={milestone.title}
                        onBlur={(e) => handleSaveMilestone(milestone.id, e.target.value)}
                        className="w-full bg-white rounded px-2 py-1"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{milestone.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-indigo-600">+{milestone.xpReward} XP</span>
                          <button 
                            onClick={() => handleEditMilestone(milestone.id)}
                            className="p-1 hover:bg-indigo-100 rounded"
                          >
                            <Edit2 className="h-4 w-4 text-indigo-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regular Tasks */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Regular Tasks</h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    {task.editable ? (
                      <input
                        type="text"
                        defaultValue={task.title}
                        onBlur={(e) => handleSaveTask(task.id, e.target.value)}
                        className="w-full bg-white rounded px-2 py-1"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{task.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">+{task.xpReward} XP</span>
                          <button 
                            onClick={() => handleEditTask(task.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit2 className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Metrics */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Progress Metrics</h3>
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.id} className="bg-green-50 rounded-lg p-4">
                  {metric.editable ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        defaultValue={metric.name}
                        placeholder="Metric name"
                        className="w-full bg-white rounded px-2 py-1"
                      />
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          defaultValue={metric.target}
                          placeholder="Target"
                          className="w-24 bg-white rounded px-2 py-1"
                        />
                        <select
                          defaultValue={metric.frequency}
                          className="bg-white rounded px-2 py-1"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <button
                          onClick={() => handleSaveMetric(metric.id, {
                            name: metric.name,
                            target: metric.target,
                            frequency: metric.frequency
                          })}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-900">{metric.name}</p>
                        <p className="text-sm text-green-700">
                          Target: {metric.target} per {metric.frequency}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleEditMetric(metric.id)}
                        className="p-1 hover:bg-green-100 rounded"
                      >
                        <Edit2 className="h-4 w-4 text-green-600" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Back
            </button>
            <button
              onClick={() => onSubmit({ tasks, milestones, metrics })}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Create Goal
            </button>
          </div>
        </>
      )}
    </div>
  );
}