// contexts/FriendsContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface FriendsContextType {
  refreshFriendBoats: () => void;
  setRefreshFriendBoats: (callback: () => void) => void;
}

const FriendsContext = createContext<FriendsContextType>({
  refreshFriendBoats: () => {},
  setRefreshFriendBoats: () => {},
});

export function FriendsProvider({ children }: { children: React.ReactNode }) {
  const [refreshFriendBoats, setRefreshFriendBoats] = useState<() => void>(() => () => {});

  return (
    <FriendsContext.Provider value={{ refreshFriendBoats, setRefreshFriendBoats }}>
      {children}
    </FriendsContext.Provider>
  );
}

export const useFriends = () => useContext(FriendsContext);