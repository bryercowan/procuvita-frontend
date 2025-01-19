import React, { useState } from 'react';
import { Layout, Plus } from 'lucide-react';
import DailyProgress from './DailyProgress';
import Calendar from './Calendar';
import GoalForm from './GoalForm';
import XPWebChart from './XPWebChart';
import CategoryView from './CategoryView';
import ProgressTracking from './ProgressTracking';
import type { Goal, CalendarEvent, Agent } from '../types';

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Morning Workout',
      start: new Date().setHours(9, 0, 0, 0).toString(),
      end: new Date().setHours(10, 0, 0, 0).toString(),
      category: 'Health',
      backgroundColor: '#EEF2FF',
      details: `Today's Workout:
1. Warm-up (10 mins)
   - Light jogging
   - Dynamic stretches
2. Main Workout (40 mins)
   - Squats: 3 sets x 12 reps
   - Bench Press: 3 sets x 10 reps
   - Deadlifts: 3 sets x 8 reps
   - Pull-ups: 3 sets x failure
3. Cool-down (10 mins)
   - Static stretches
   - Light walking`
    }
  ]);

  // Mock data for development
  const categoryXP = {
    Health: 850,
    Career: 1200,
    Learning: 650,
    Finance: 750,
    Personal: 1100
  };

  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'Coach Alex',
      personality: 'stern',
      avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150',
      specialty: 'Health & Fitness'
    }
  ];

  const mockAchievements = [
    {
      id: '1',
      title: 'Early Bird',
      description: 'Complete 5 tasks before 9 AM',
      icon: 'star' as const,
      rarity: 'rare' as const,
      unlockedAt: '2024-03-13'
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day streak',
      icon: 'flame' as const,
      rarity: 'epic' as const,
      unlockedAt: '2024-03-14'
    },
    {
      id: '3',
      title: 'Goal Crusher',
      description: 'Complete your first major milestone',
      icon: 'trophy' as const,
      rarity: 'legendary' as const,
      unlockedAt: '2024-03-14'
    }
  ];

  const handleAddGoal = (goal: Partial<Goal>) => {
    // In a real app, this would make an API call
    const newGoal = {
      ...goal,
      id: Math.random().toString(),
      userId: '1',
      xp: 0,
      level: 1,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      agent: mockAgents[0]
    };
    setGoals(prev => [...prev, newGoal as Goal]);
    setShowGoalForm(false);
  };

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.random().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleRescheduleEvent = (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    setEvents(prev => prev.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          start: newStart.toISOString(),
          end: newEnd.toISOString()
        };
      }
      return e;
    }));
  };

  const handleUpdateEventDetails = (event: CalendarEvent, newDetails: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          details: newDetails
        };
      }
      return e;
    }));
  };

  const handleAskCoach = (event: CalendarEvent, question: string) => {
    // In a real app, this would send the question to the AI coach
    console.log('Question about', event.title, ':', question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Procuvita</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowGoalForm(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </button>
              <span className="text-sm text-gray-500">Level 8 Life Adventurer</span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {selectedCategory ? (
              <CategoryView
                category={selectedCategory}
                goals={goals.filter(g => g.category === selectedCategory)}
                agent={mockAgents.find(a => a.specialty.includes(selectedCategory)) || mockAgents[0]}
                onBack={() => setSelectedCategory(null)}
              />
            ) : (
              <>
                <XPWebChart 
                  data={categoryXP}
                  onCategoryClick={setSelectedCategory}
                />
                <Calendar 
                  events={events}
                  onAddEvent={handleAddEvent}
                  onRescheduleEvent={handleRescheduleEvent}
                  onAskCoach={handleAskCoach}
                  onUpdateEventDetails={handleUpdateEventDetails}
                />
              </>
            )}
          </div>
          <div className="space-y-8">
            <DailyProgress goals={goals} />
            <ProgressTracking
              level={8}
              xp={7850}
              streak={5}
              achievements={mockAchievements}
            />
          </div>
        </div>
      </main>

      {showGoalForm && (
        <GoalForm
          onSubmit={handleAddGoal}
          onClose={() => setShowGoalForm(false)}
        />
      )}
    </div>
  );
}