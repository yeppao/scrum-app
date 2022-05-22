import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UsersContext } from '@context/UsersContext';
import { SocketContext } from '@context/SocketContext';
import { AppContext } from '@context/AppContext';
import { RoomContext } from '@context/RoomContext';
import { getJiraUsers } from '@repositories/users';
import { Chip } from 'primereact/chip';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import _ from 'lodash';
import { Button } from 'primereact/button';

const userTemplate = jiraUser => (
  <div>
    <span role="img" aria-label={jiraUser.displayName}>
      <img style={{ width: '16px', height: '16px' }} src={jiraUser.avatarUrls['16x16']} alt={jiraUser.displayName} />
    </span>
    <span style={{ fontWeight: 'bold', marginLeft: 6 }}>{jiraUser.displayName}</span>
  </div>
);

const Login = () => {
  const { socket } = useContext(SocketContext);
  const { toast, currentUser, setCurrentUser, setSelectedRoom, setStep } = useContext(AppContext);
  const { setRooms } = useContext(RoomContext);
  const navigate = useNavigate();
  const { setUsers } = useContext(UsersContext);
  const [jiraUsers, setJiraUsers] = useState([]);
  const [skills, setSkills] = useState([]);


  //Checks to see if there's a user already present

  useEffect(() => {
    const retrieveUsers = async () => {
      setStep(0);
      socket.on('users', users => {
        setUsers(users);
      });
      const retrievedJiraUsers = await getJiraUsers();
      setJiraUsers(retrievedJiraUsers);
    }
    retrieveUsers();
  }, [setStep, setUsers, socket]);

  const onFinish = () => {
    const userData = {
      ...currentUser,
      skills: skills
    };

    setCurrentUser(userData);
    socket.emit('login', userData, error => {
      if (error) {
        toast.current.show({severity: 'warn', summary: 'Warn Message', detail: error});
      }
    });

    socket.on('login', ({ roomId }) => {
      setSelectedRoom(roomId);
      setRooms({ default: {} });
      navigate('/projects');
      toast.current.show({severity: 'success', summary: 'Success Message', detail: `Welcome to ${roomId}`});
    });
  }

  return (
    <div>
      <Dropdown
          options={jiraUsers}
          optionLabel="displayName"
          rules={[{ required: true, message: 'Please input your username!' }]}
          filter
          filterBy="displayName"
          itemTemplate={userTemplate}
          onChange={e => setCurrentUser(e.value)}
          value={currentUser}
        />

        <Dropdown options={[{ label: 'Front', value: 'front' }, { label: 'Back', value: 'back' }]} onChange={e => setSkills([e.value])} />
        {skills.map(skill => <Chip label={skill} removable />)}
        <Button type="primary" onClick={onFinish}>
          Submit
        </Button>
    </div>
  )
}

export default Login;
