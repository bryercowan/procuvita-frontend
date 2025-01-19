export interface User {
  id: string;
  displayName: string | null;
  level: number;
  totalXp: number;
}

export interface Goal {
  id: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  xp: number;
  level: number;
  status: 'active' | 'paused';
  createdAt: string;
  agent: Agent;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  xpReward: number;
  duration: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'delegated_to_ai';
  aiAssignable: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  personality: 'stern' | 'empathetic' | 'balanced';
  avatarUrl: string;
  specialty: string;
  taskQueue?: Task[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  taskId?: string;
  category?: string;
  backgroundColor?: string;
  details?: string; // Added for event details like workout plan
}