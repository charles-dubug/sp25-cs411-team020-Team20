import React from 'react';

interface RatingRingProps {
  rating: number;
  label: string;
}

export function RatingRing({ rating, label }: RatingRingProps) {
  const circumference = 2 * Math.PI * 18; // 18 is the radius
  const strokeDashoffset = circumference - (rating / 5) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg className="w-12 h-12" viewBox="0 0 40 40">
        <circle
          className="text-muted-foreground"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="18"
          cx="20"
          cy="20"
        />
        <circle
          className="text-primary"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="#fad902"
          fill="transparent"
          r="18"
          cx="20"
          cy="20"
        />
        <text
          x="20"
          y="20"
          className="text-xs font-medium"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="currentColor"
        >
          {rating}
        </text>
      </svg>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
}

