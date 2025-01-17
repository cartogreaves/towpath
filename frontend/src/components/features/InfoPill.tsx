// src/components/features/InfoPill.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import InfoPanel from './InfoPanel';

interface InfoPillProps {
  title: string;
  feature: any;
}

export default function InfoPill({ title, feature }: InfoPillProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
        <div 
          className="flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer shadow-lg transition-colors bg-component-navy hover:bg-component-navy-hover"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-major-blue font-medium">
            {title}
          </span>
          <ChevronDown 
            className={`w-4 h-4 transform transition-transform text-major-blue
              ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      <InfoPanel 
        isOpen={isExpanded} 
        onClose={() => setIsExpanded(false)}
        feature={feature}
      />
    </>
  );
}