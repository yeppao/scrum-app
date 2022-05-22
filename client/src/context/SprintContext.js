import React, { useState } from 'react';

export const SprintContext = React.createContext();

export const SprintProvider = ({ children }) => {
  const [sprintId, setSprintId] = useState();
  const [boardId, setBoardId] = useState();
  const [issues, setIssues] = useState([]);

  return (
      <SprintContext.Provider value={{ boardId, setBoardId, sprintId, setSprintId, issues, setIssues }}>
        {children}
      </SprintContext.Provider>
  )
};
