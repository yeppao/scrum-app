import React, { useContext, useEffect, useState } from 'react';

import { Badge } from 'primereact/badge';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { AppContext } from '@context/AppContext';
import { SocketContext } from '@context/SocketContext';
import { UsersContext } from '@context/UsersContext';
import { createTeamSessionGroups } from '@repositories/groups';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const Groups = () => {
  const { currentUser, teamSession } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const { groups, setGroups } = useContext(UsersContext);
  const [groupsNumber, setGroupsNumber] = useState(0);

  useEffect(() => console.log(groups), [groups]);

  const onFinish = async () => {
    console.log('Received values of form:', groupsNumber);
    const receivedGroups = await createTeamSessionGroups(teamSession.id, groupsNumber);
    setGroups(receivedGroups);
  };

  const beginWork = () => {
    socket.emit('work');
  }

  const onReset = () => {
    socket.emit('resetGroups');
  }

  return (
    <>
      <div>
          <label htmlFor="groups-number">Groups number</label>
          <InputText id="groups-number" onChange={e => setGroupsNumber(e.target.value)} />
          <Button type="primary" onClick={onFinish}>
            Submit
          </Button>
          <Button onClick={onReset}>
            Reset
          </Button>
          {groups.length && groups.map(group => (
            <Card title={`Group ${group.id}`}>
            <h1>Users <Badge count={group.users.length} /></h1>
            {group.users.map(user => (
              <div>
                {user.name}
                {user.skills.map(skill => <Tag color="green">{skill}</Tag>)}
              </div>
            ))}
            <h1>Issues <Badge count={group.issues.length} /><Badge count={group.issues.filter(issue => issue.fields.labels.includes('front')).length} style={{ backgroundColor: '#52c41a' }} /><Badge count={group.issues.filter(issue => issue.fields.labels.includes('back')).length} style={{ backgroundColor: '#1890ff' }} /></h1>
            {group.issues.map(issue => (
              <div>
                <img width={16} height={16} src={issue.fields.issuetype.iconUrl} />
                {`[${issue.key}] ${issue.fields.summary}`}
                {issue.fields.labels.map(label => <Tag color="geekblue">{label}</Tag>)}
                <Divider />
              </div>
            ))}
            </Card>
          ))}
      </div>
      <div>
        <Button type="primary" onClick={beginWork}>Démarrer le job</Button>
      </div>
    </>
  );
}

export default Groups;
