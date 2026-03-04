// components/ErrorMessage.tsx
import { FC } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-red-400">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;