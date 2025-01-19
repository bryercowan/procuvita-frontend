import React from 'react';
import { Trophy, Star, Flame, Award, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'flame' | 'award';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

interface ProgressTrackingProps {
  level: number;
  xp: number;
  streak: number;
  achievements: Achievement[];
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-yellow-500'
};

const iconMap = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  award: Award
};

export default function ProgressTracking({ level, xp, streak, achievements }: ProgressTrackingProps) {
  const xpToNextLevel = 1000; // Example: 1000 XP per level
  const currentLevelXP = xp % xpToNextLevel;
  const progress = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Progress & Achievements</h2>
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium text-gray-900">{streak} Day Streak</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Level {level}</span>
          <span className="text-sm text-gray-500">{currentLevelXP} / {xpToNextLevel} XP</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Current Level</span>
          <span>Next Level</span>
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 gap-4">
          {achievements.map(achievement => {
            const Icon = iconMap[achievement.icon];
            return (
              <div 
                key={achievement.id}
                className="relative group"
              >
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${rarityColors[achievement.rarity]}
                  opacity-10 rounded-lg group-hover:opacity-20 transition-opacity
                `} />
                <div className="relative flex items-start space-x-4 p-4 rounded-lg border">
                  <div className={`
                    p-3 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]}
                  `}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`
                        text-xs font-medium px-2 py-1 rounded-full
                        ${achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                          achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                          achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress History */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Weekly Progress</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayProgress = Math.random() * 100; // Example data
            return (
              <div key={i} className="space-y-2">
                <div className="h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ 
                      height: `${dayProgress}%`,
                      marginTop: `${100 - dayProgress}%`
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-500">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}