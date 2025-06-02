// src/components/ConsultationBadge.tsx
import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface ConsultationBadgeProps {
  type: 'required' | 'included' | 'optional';
  size?: 'sm' | 'md';
}

const ConsultationBadge: React.FC<ConsultationBadgeProps> = ({ type, size = 'md' }) => {
  const sizeClasses =
    size === 'sm' ? 'text-xs px-2 py-0.5 rounded-full' : 'text-sm px-3 py-1 rounded-full';

  switch (type) {
    case 'required':
      return (
        <span className={`bg-orange-500/20 text-orange-400 ${sizeClasses} flex items-center`}>
          <AlertCircle size={size === 'sm' ? 10 : 14} className="mr-1" />
          Требуется консультация
        </span>
      );
    case 'included':
      return (
        <span className={`bg-green-500/20 text-green-400 ${sizeClasses} flex items-center`}>
          <Check size={size === 'sm' ? 10 : 14} className="mr-1" />
          Включает консультацию
        </span>
      );
    case 'optional':
      return (
        <span className={`bg-blue-500/20 text-blue-400 ${sizeClasses}`}>
          Консультация необязательна
        </span>
      );
    default:
      return null;
  }
};

export default ConsultationBadge;
