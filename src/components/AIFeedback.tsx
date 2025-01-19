import React from 'react';
import { MessageSquare, Brain, Sparkles, TrendingUp, Target } from 'lucide-react';
import type { Agent, Task, Goal } from '../types';

interface AIFeedbackProps {
  agent: Agent;
  goal: Goal;
  feedback: {
    message: string;
    suggestions?: string[];
    adjustments?: {
      type: 'increase' | 'decrease';
      metric: string;
      reason: string;
    }[];
    progress?: {
      metric: string;
      current: number;
      target: number;
      trend: 'up' | 'down' | 'stable';
    }[];
  };
}

export default function AIFeedback({ agent, goal, feedback }: AIFeedbackProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Agent Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
        <div className="flex items-center space-x-4">
          <img
            src={agent.avatarUrl}
            alt={agent.name}
            className="h-12 w-12 rounded-full border-2 border-white object-cover"
          />
          <div>
            <h3 className="font-medium text-white">{agent.name}</h3>
            <p className="text-indigo-100 text-sm">{agent.specialty}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Feedback Message */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MessageSquare className="h-5 w-5 text-indigo-600 mt-1" />
            <div>
              <p className="text-indigo-900 font-medium">Feedback</p>
              <p className="text-indigo-800 mt-1">{feedback.message}</p>
            </div>
          </div>
        </div>

        {/* Progress Metrics */}
        {feedback.progress && feedback.progress.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Progress Tracking</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback.progress.map((metric, index) => (
                <div key={index} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{metric.metric}</span>
                    <TrendingUp className={`h-4 w-4 ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 
                      'text-yellow-500'
                    }`} />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-gray-900">{metric.current}</span>
                      <span className="text-sm text-gray-500">Target: {metric.target}</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${(metric.current / metric.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Suggestions</h4>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
              {feedback.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Sparkles className="h-4 w-4 text-purple-600 mt-1" />
                  <span className="text-purple-900">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adjustments */}
        {feedback.adjustments && feedback.adjustments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Recommended Adjustments</h4>
            </div>
            <div className="space-y-2">
              {feedback.adjustments.map((adjustment, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    adjustment.type === 'increase' 
                      ? 'bg-green-50 text-green-900'
                      : 'bg-red-50 text-red-900'
                  }`}
                >
                  <span className={`flex items-center justify-center h-6 w-6 rounded-full ${
                    adjustment.type === 'increase'
                      ? 'bg-green-200 text-green-700'
                      : 'bg-red-200 text-red-700'
                  }`}>
                    {adjustment.type === 'increase' ? '+' : '-'}
                  </span>
                  <div>
                    <p className="font-medium">{adjustment.metric}</p>
                    <p className={`text-sm ${
                      adjustment.type === 'increase' 
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {adjustment.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}