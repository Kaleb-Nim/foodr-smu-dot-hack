import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestaurantCountProps {
  count: number;
  cuisine: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RestaurantCount({ 
  count, 
  cuisine, 
  className,
  size = 'md' 
}: RestaurantCountProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 bg-[#F1204A] text-[#e9e9e9] rounded-full font-bold',
      sizeClasses[size],
      className
    )}>
      <MapPin size={iconSizes[size]} />
      <span>
        {count} near SMU
      </span>
    </div>
  );
}

interface RestaurantCountWithTooltipProps extends RestaurantCountProps {
  showTooltip?: boolean;
}

export function RestaurantCountWithTooltip({ 
  showTooltip = false,
  ...props 
}: RestaurantCountWithTooltipProps) {
  if (!showTooltip) {
    return <RestaurantCount {...props} />;
  }

  return (
    <div className="relative group ">
      <RestaurantCount {...props} />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#F1204A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {props.count} {props.cuisine} restaurants within walking distance of SMU campus
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}