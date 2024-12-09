import { ShipWheel } from 'lucide-react';

interface BoatMarkerProps {
  size?: number;
  className?: string;
}

const BoatMarker = ({ size = 25 }: BoatMarkerProps) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="rounded-full p-1 bg-gray-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <ShipWheel
          size={size}
          className="text-blue-600"
        />
      </div>
    </div>
  );
};

export default BoatMarker;