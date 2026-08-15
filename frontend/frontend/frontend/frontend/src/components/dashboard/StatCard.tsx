import { useState } from 'react';

/**
 * Statistic card component for displaying KPIs.
 */
interface StatCardProps {
  /** Title of the statistic. */
  title: string;
  /** Value to display. */
  value: number | string;
  /** Optional icon component. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional color variant. */
  variant?: 'blue' | 'green' | 'yellow' | 'red';
  /** Optional prefix for the value (e.g., '$'). */
  prefix?: string;
  /** Optional suffix for the value (e.g., '%'). */
  suffix?: string;
  /** Whether to show a loading state instead of the value. */
  isLoading?: boolean;
  /** Error message if applicable. */
  error?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  variant = 'blue',
  prefix = '',
  suffix = '',
  isLoading = false,
  error
}: StatCardProps) => {
  const [showError, setShowError] = useState(false);

  // Handle error state
  if (error) {
    setShowError(true);
  }

  const getVariantColors = (v: string) => {
    switch (v) {
      case 'green': return { bg: 'bg-green-50', text: 'text-green-600' };
      case 'yellow': return { bg: 'bg-yellow-50', text: 'text-yellow-600' };
      case 'red': return { bg: 'bg-red-50', text: 'text-red-600' };
      default: return { bg: 'bg-blue-50', text: 'text-blue-600' };
    }
  };

  const { bg, text } = getVariantColors(variant);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {icon && <icon className={`h-5 w-5 mr-3 ${text}`} />}
          <h3 className={`-mb-px text-sm font-medium text-gray-500 truncate max-w-xs`}>
            {title}
          </h3>
        </div>
        {showError && (
          <div className="flex items-center gap-2">
            <span className="text-red-600">������⚠������️</span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="h-8 flex items-center justify-center bg-gray-100 rounded">
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse ml-2" />
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse ml-2" />
        </div>
      ) : (
        <p className={`text-2xl font-bold text-gray-900 ${showError ? 'text-red-600' : ''}`}>
          {prefix}{value}{suffix}
        </p>
      )}
    </div>
  );
};
