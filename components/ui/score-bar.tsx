import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  className?: string;
  showScore?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBar({
  score,
  maxScore = 12, // Default max score (4 users × 3 points each)
  className,
  showScore = true,
  animated = true,
  size = 'md',
}: ScoreBarProps) {
  // Normalize score to percentage (0-100)
  const normalizedScore = Math.max(0, Math.min(100, (score / maxScore) * 100));
  
  // Determine color based on score
  const getColorClass = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 0) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const colorClass = getColorClass(score, maxScore);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Progress Bar */}
      <div className={cn(
        'flex-1 bg-gray-200 rounded-full overflow-hidden relative',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClass,
            animated && 'animate-pulse'
          )}
          style={{
            width: `${normalizedScore}%`,
            minWidth: score > 0 ? '8px' : '0px', // Minimum visible width for positive scores
          }}
        />
        
        {/* Subtle shine effect */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            width: `${normalizedScore}%`,
            animation: animated ? 'shimmer 2s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* Score Display */}
      {showScore && (
        <div className={cn(
          'font-semibold text-gray-700 min-w-[3rem] text-right',
          textSizeClasses[size]
        )}>
          {score > 0 ? `+${score}` : score}
        </div>
      )}
    </div>
  );
}

// Enhanced Score Bar with breakdown tooltip
interface DetailedScoreBarProps extends ScoreBarProps {
  breakdown: {
    superlikes: number;
    likes: number;
    dislikes: number;
  };
  showBreakdown?: boolean;
}

export function DetailedScoreBar({
  breakdown,
  showBreakdown = false,
  ...props
}: DetailedScoreBarProps) {
  const totalScore = breakdown.superlikes * 3 + breakdown.likes * 1 + breakdown.dislikes * (-1);
  
  return (
    <div className="space-y-2">
      <ScoreBar {...props} score={totalScore} />
      
      {showBreakdown && (
        <div className="flex gap-4 text-xs text-gray-600">
          {breakdown.superlikes > 0 && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {breakdown.superlikes} superlike{breakdown.superlikes !== 1 ? 's' : ''}
            </span>
          )}
          {breakdown.likes > 0 && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {breakdown.likes} like{breakdown.likes !== 1 ? 's' : ''}
            </span>
          )}
          {breakdown.dislikes > 0 && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {breakdown.dislikes} dislike{breakdown.dislikes !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// CSS for shimmer animation (add to global styles)
export const scoreBarStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;