import React, { useState } from 'react';

export const UsersContext = React.createContext();

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState({});

    return (
        <UsersContext.Provider value={{
          users, setUsers,
          groups, setGroups,
          selectedGroup, setSelectedGroup
        }}>
            {children}
        </UsersContext.Provider>
    )
}
