import { Spinner } from 'react-spinners';

/**
 * Simple loading state component.
 */
export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner 
        color="#3b82f6" 
        size={40} 
        css={{
          display: 'block',
          margin: '0 auto'
        }} 
      />
      <p className="mt-4 text-gray-500">Loading...</p>
    </div>
  );
};
