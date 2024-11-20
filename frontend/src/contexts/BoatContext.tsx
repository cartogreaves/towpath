import React, { createContext, useContext, useState } from 'react';

interface BoatContextType {
  clearBoatMarker: () => void;
  setClearBoatMarker: (fn: () => void) => void;
}

const BoatContext = createContext<BoatContextType>({
  clearBoatMarker: () => {},
  setClearBoatMarker: () => {},
});

export function BoatProvider({ children }: { children: React.ReactNode }) {
  const [clearBoatMarker, setClearBoatMarker] = useState<() => void>(() => () => {});

  return (
    <BoatContext.Provider value={{ clearBoatMarker, setClearBoatMarker }}>
      {children}
    </BoatContext.Provider>
  );
}

export const useBoat = () => useContext(BoatContext); 