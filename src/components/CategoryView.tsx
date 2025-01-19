import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import type { Goal, Agent } from '../types';

interface CategoryViewProps {
  category: string;
  goals: Goal[];
  agent: Agent;
  onBack: () => void;
}

export default function CategoryView({ category, goals, agent, onBack }: CategoryViewProps) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      role: 'agent',
      content: `Hi! I'm ${agent.name}, your ${agent.personality} guide for ${category}. How can I help you today?`
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setChat(prev => [...prev, { role: 'user', content: message }]);

    // Simulate AI response
    setTimeout(() => {
      setChat(prev => [...prev, {
        role: 'agent',
        content: `Based on your ${category.toLowerCase()} goals, I suggest focusing on consistent daily actions. Would you like me to break down your next milestone into smaller tasks?`
      }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Overview
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
        </div>
      </div>

      {/* Goals Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Goals</h3>
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <span className="text-sm text-gray-500">Level {goal.level}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(goal.xp % 1000) / 10}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">{goal.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <img
              src={agent.avatarUrl}
              alt={agent.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500">{agent.specialty}</p>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-6">
          <div className="space-y-4">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your AI guide a question..."
              className="flex-1 rounded-lg border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}