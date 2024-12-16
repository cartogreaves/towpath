interface FriendBoatMarkerProps {
  size?: number;
  className?: string;
  avatar: string;
}

const FriendBoatMarker = ({ size = 25, avatar }: FriendBoatMarkerProps) => {
  const avatarSize = Math.floor(size * 0.8);
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="rounded-full p-1 flex items-center justify-center bg-component-navy">
        <div 
          style={{ width: `${size}px`, height: `${size}px` }} 
          className="flex items-center justify-center"
        >
          <span 
            className="leading-none"
            style={{ fontSize: `${avatarSize}px` }}
          >
            {avatar}
          </span>
        </div>
      </div>
    </div>
  );
};

  export default FriendBoatMarker;