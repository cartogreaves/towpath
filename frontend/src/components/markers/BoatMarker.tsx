import { ShipWheel } from 'lucide-react';

interface BoatMarkerProps {
  size?: number;
  className?: string;
}

const BoatMarker = ({ size = 25 }: BoatMarkerProps) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="rounded-full p-1 bg-component-navy">
        <ShipWheel
          size={size}
          className="text-major-blue"
        />
      </div>
    </div>
  );
};

export default BoatMarker;