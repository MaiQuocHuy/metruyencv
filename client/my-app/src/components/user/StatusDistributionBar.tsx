import { StatusDistributionBarProps } from '@/types/user';
import React from 'react';

export function StatusDistributionBar({
  label,
  count,
  total,
  colorClass
}: StatusDistributionBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="font-medium">{label}</div>
        <div>
          {count} user{count !== 1 ? 's' : ''}
        </div>
      </div>
      <div
        className="bg-muted h-2 w-full overflow-hidden rounded-full"
        role="meter"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} status percentage`}
      >
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default StatusDistributionBar;
