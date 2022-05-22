import React, { useRef, useState } from 'react';

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [selectedRoom, setSelectedRoom] = useState('');
  const [roomsMessages, setRoomsMessages] = useState([]);
  const [teamSession, setTeamSession] = useState({});
  const [step, setStep] = useState(1);
  const toast = useRef();

  return (
      <AppContext.Provider value={{
        currentUser, setCurrentUser,
        roomsMessages, setRoomsMessages,
        selectedRoom, setSelectedRoom,
        step, setStep,
        teamSession, setTeamSession,
        toast
      }}>
        {children}
      </AppContext.Provider>
  )
};
