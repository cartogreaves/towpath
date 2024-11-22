interface FriendBoatMarkerProps {
    size?: number;
    className?: string;
    isDarkMode: boolean;
    avatar: string;
  }
  
  const FriendBoatMarker = ({ size = 25, className = '', isDarkMode, avatar }: FriendBoatMarkerProps) => {
    // Calculate a proportional size for the avatar (about 60% of the container size)
    const avatarSize = Math.floor(size * 0.8);
    
    return (
      <div className="relative flex flex-col items-center">
        <div className={`rounded-full p-1 flex items-center justify-center ${
          isDarkMode 
            ? 'bg-gray-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.3)]' 
            : 'bg-white/90 shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
        }`}>
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