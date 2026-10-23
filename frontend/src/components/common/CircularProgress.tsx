import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
  textColor?: string;
  showText?: boolean;
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  circleColor = 'text-slate-100',
  progressColor = 'stroke-indigo-600',
  textColor = 'text-slate-900',
  showText = true,
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`stroke-current ${circleColor}`}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`stroke-current transition-all duration-1000 ease-out ${progressColor}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-bold tracking-tight ${textColor}`}>
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
