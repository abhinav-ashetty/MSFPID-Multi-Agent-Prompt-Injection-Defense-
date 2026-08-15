/**
 * Empty state component.
 */
interface EmptyStateProps {
  /** Title to display. */
  title: string;
  /** Description to display. */
  description: string;
  /** Optional action button text. */
  actionText?: string;
  /** Optional action callback. */
  onAction?: () => void;
  /** Optional custom class name. */
  className?: string;
}

export const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  onAction, 
  className = '' 
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 mb-4">
        {/* Empty state icon */}
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 17v-2m3 2v-2m-3 2h-.01M3 9h2m8-2h2m8 2h2M5 12H3.239a3 3 0 101.761 4.127l.31.088a3 3 0 003.447 2.652L11 21h10a3 3 0 002.906-1.65L21.24 13.37a3 3 0 00-1.76-3.365l-.087-.31A3 3 0 0019.239 9h-3.761a3 3 0 00-4.233-1.732l-.244-.117A3 3 0 0013 3h-4a3 3 0 00-4.233 1.732l-.244.117A3 3 0 003.239 7.239l.087.31a3 3 0 001.761 3.365z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
