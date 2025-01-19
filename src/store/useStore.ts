import { create } from 'zustand';
import type { User, Goal, Task, Agent } from '../types';
import { supabase } from '../lib/supabase';

interface Store {
  user: User | null;
  goals: Goal[];
  agents: Agent[];
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setGoals: (goals: Goal[]) => void;
  setAgents: (agents: Agent[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchGoals: () => Promise<void>;
  fetchAgents: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'xp' | 'level'>) => Promise<void>;
  updateGoalStatus: (goalId: string, status: Goal['status']) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  goals: [],
  agents: [],
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setGoals: (goals) => set({ goals }),
  setAgents: (agents) => set({ agents }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchGoals: async () => {
    try {
      set({ loading: true });
      const { data: goals, error } = await supabase
        .from('goals')
        .select(`
          *,
          agent:ai_agents(*)
        `)
        .eq('user_id', get().user?.id);

      if (error) throw error;
      set({ goals, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchAgents: async () => {
    try {
      set({ loading: true });
      const { data: agents, error } = await supabase
        .from('ai_agents')
        .select('*');

      if (error) throw error;
      set({ agents, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addGoal: async (goal) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...goal,
          user_id: get().user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      set({ goals: [...get().goals, data], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateGoalStatus: async (goalId, status) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('goals')
        .update({ status })
        .eq('id', goalId)
        .eq('user_id', get().user?.id);

      if (error) throw error;
      set({
        goals: get().goals.map(g => 
          g.id === goalId ? { ...g, status } : g
        ),
        error: null
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      
      // Update the related goal's tasks
      const updatedGoals = get().goals.map(goal => {
        if (goal.id === task.goalId) {
          return {
            ...goal,
            tasks: [...(goal.tasks || []), data]
          };
        }
        return goal;
      });
      
      set({ goals: updatedGoals, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;

      // Update the task status in the local state
      const updatedGoals = get().goals.map(goal => ({
        ...goal,
        tasks: goal.tasks?.map(t =>
          t.id === taskId ? { ...t, status } : t
        )
      }));
      
      set({ goals: updatedGoals, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));