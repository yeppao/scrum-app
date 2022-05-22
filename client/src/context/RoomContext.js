import React, { useState } from 'react';

export const RoomContext = React.createContext();

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState({});

  return (
      <RoomContext.Provider value={{ rooms, setRooms }}>
        {children}
      </RoomContext.Provider>
  )
};
