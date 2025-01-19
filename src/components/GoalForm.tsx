import React, { useState } from 'react';
import { X, Brain, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Goal } from '../types';
import TaskBreakdownForm from './TaskBreakdownForm';

interface GoalFormProps {
  onSubmit: (goal: Partial<Goal>) => void;
  onClose: () => void;
}

type Step = 'initial' | 'breakdown';

export default function GoalForm({ onSubmit, onClose }: GoalFormProps) {
  const [step, setStep] = useState<Step>('initial');
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: ''
  });

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('breakdown');
  };

  const handleBreakdownComplete = (breakdown: any) => {
    onSubmit({
      ...formData,
      tasks: breakdown.tasks,
      milestones: breakdown.milestones
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-hidden">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'initial' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
              }`}>
                <Target className="h-5 w-5" />
              </div>
              <div className="h-0.5 w-12 bg-gray-200" />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === 'breakdown' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
              }`}>
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'initial' && (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">What's your life goal?</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Share your aspirations, and I'll help you break them down into achievable steps.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Health">Health</option>
                      <option value="Career">Career</option>
                      <option value="Personal">Personal</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">What do you want to achieve?</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="e.g., Master web development"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Why is this important to you?</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      rows={3}
                      placeholder="This will help me understand your motivation and create a better plan"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md inline-flex items-center"
                >
                  Generate Plan
                  <Brain className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'breakdown' && (
            <TaskBreakdownForm
              goal={formData}
              onSubmit={handleBreakdownComplete}
              onBack={() => setStep('initial')}
            />
          )}
        </div>
      </div>
    </div>
  );
}