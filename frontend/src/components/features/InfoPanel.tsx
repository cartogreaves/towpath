import { X } from 'lucide-react';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  feature: any;
}

export default function InfoPanel({ isOpen, onClose, feature }: InfoPanelProps) {
    if (!isOpen) return null;
  
    return (
      <div 
        className="fixed bottom-0 left-0 right-0 transform transition-transform duration-200 ease-in-out z-30"
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="mx-auto max-w-2xl bg-gray-800 shadow-lg rounded-t-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-white">
              Feature Details
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-4 text-gray-300">
            {Object.entries(feature.properties).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }