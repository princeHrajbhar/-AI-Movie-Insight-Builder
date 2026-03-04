// components/LoadingSpinner.tsx
import { FC } from 'react';
import { Film } from 'lucide-react';

const LoadingSpinner: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
        <Film className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
      </div>
      <p className="mt-4 text-gray-400">Analyzing movie audience insights...</p>
    </div>
  );
};

export default LoadingSpinner;