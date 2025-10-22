export interface Badge {
  name: string;
  minPoints: number;
  color: string;
  icon: string;
}

export const badges: Badge[] = [
  { name: "Newcomer", minPoints: 0, color: "bg-gray-500", icon: "🌱" },
  { name: "Explorer", minPoints: 50, color: "bg-blue-500", icon: "🔍" },
  { name: "Contributor", minPoints: 150, color: "bg-green-500", icon: "✨" },
  { name: "Expert", minPoints: 300, color: "bg-purple-500", icon: "🎯" },
  { name: "Master", minPoints: 500, color: "bg-orange-500", icon: "🏆" },
  { name: "Legend", minPoints: 1000, color: "bg-yellow-500", icon: "👑" },
];

export function getBadge(points: number): Badge {
  for (let i = badges.length - 1; i >= 0; i--) {
    if (points >= badges[i].minPoints) {
      return badges[i];
    }
  }
  return badges[0];
}

export function getNextBadge(points: number): Badge | null {
  for (const badge of badges) {
    if (points < badge.minPoints) {
      return badge;
    }
  }
  return null;
}

export function getProgressToNextBadge(points: number): number {
  const nextBadge = getNextBadge(points);
  if (!nextBadge) return 100;

  const currentBadge = getBadge(points);
  const range = nextBadge.minPoints - currentBadge.minPoints;
  const progress = points - currentBadge.minPoints;
  
  return (progress / range) * 100;
}
