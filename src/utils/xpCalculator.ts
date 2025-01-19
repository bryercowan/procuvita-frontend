import type { CalendarEvent } from '../types';

// Category multipliers for different types of activities
const categoryMultipliers: Record<string, number> = {
  Health: 1.2,    // Health activities often require more effort
  Career: 1.1,    // Career development is challenging
  Learning: 1.15, // Learning new skills takes focus
  Personal: 1.0,  // Base multiplier for personal tasks
  Finance: 1.05   // Financial planning activities
};

// Patterns that indicate additional XP bonuses
const xpPatterns = {
  effort: {
    keywords: ['intense', 'challenging', 'advanced', 'complex'],
    bonus: 10
  },
  planning: {
    keywords: ['preparation', 'plan', 'steps', 'checklist'],
    bonus: 5
  },
  measurement: {
    keywords: ['sets', 'reps', 'minutes', 'target', 'goal'],
    bonus: 8
  }
};

/**
 * Calculate XP for an event based on various factors
 */
export function calculateEventXP(event: CalendarEvent): number {
  // 1. Base XP from duration
  const durationHours = (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60);
  let xp = Math.round(durationHours * 15);

  // 2. Apply category multiplier
  const multiplier = categoryMultipliers[event.category as keyof typeof categoryMultipliers] || 1.0;
  xp *= multiplier;

  // 3. Analyze content if details exist
  if (event.details) {
    // Structure bonus (check for numbered lists, bullet points)
    if (event.details.match(/^\d+\.|[-•]/gm)) {
      xp += 10;
    }

    // Count distinct sections/steps
    const steps = event.details.split('\n').filter(line => line.match(/^\d+\./)).length;
    xp += steps * 2;

    // Check for patterns
    Object.values(xpPatterns).forEach(pattern => {
      const matches = pattern.keywords.some(keyword => 
        event.details?.toLowerCase().includes(keyword)
      );
      if (matches) xp += pattern.bonus;
    });
  }

  return Math.round(xp);
}

/**
 * Get a breakdown of how XP was calculated
 */
export function getXPBreakdown(event: CalendarEvent): {
  base: number;
  categoryBonus: number;
  structureBonus: number;
  stepBonus: number;
  patternBonuses: { name: string; bonus: number }[];
  total: number;
} {
  const durationHours = (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60);
  const base = Math.round(durationHours * 15);
  const multiplier = categoryMultipliers[event.category as keyof typeof categoryMultipliers] || 1.0;
  const categoryBonus = Math.round(base * (multiplier - 1));
  
  let structureBonus = 0;
  let stepBonus = 0;
  const patternBonuses: { name: string; bonus: number }[] = [];

  if (event.details) {
    // Structure bonus
    if (event.details.match(/^\d+\.|[-•]/gm)) {
      structureBonus = 10;
    }

    // Step bonus
    const steps = event.details.split('\n').filter(line => line.match(/^\d+\./)).length;
    stepBonus = steps * 2;

    // Pattern bonuses
    Object.entries(xpPatterns).forEach(([name, pattern]) => {
      const matches = pattern.keywords.some(keyword => 
        event.details?.toLowerCase().includes(keyword)
      );
      if (matches) {
        patternBonuses.push({ name, bonus: pattern.bonus });
      }
    });
  }

  const total = Math.round(
    base + categoryBonus + structureBonus + stepBonus + 
    patternBonuses.reduce((sum, { bonus }) => sum + bonus, 0)
  );

  return {
    base,
    categoryBonus,
    structureBonus,
    stepBonus,
    patternBonuses,
    total
  };
}