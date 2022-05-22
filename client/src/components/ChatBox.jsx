import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import Stepper from '@components/Layout/Stepper';
import UsersList from "./UsersList";
import MessageBox from "./MessageBox";
import { SocketContext } from '@context/SocketContext';

// Use for remote connections
const configuration = {
  iceServers: [{ urls: 'stun:stun.1.google.com:19302' }]
};

// Use for local connections
// const configuration = null;

const ChatBox = () => {
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', msg => {
        setMessages(messages => [...messages, msg]);
    });
  }, [socket]);

  const handleSendMessage = () => {
    socket.emit('sendMessage', message, () => setMessage(''))
    setMessage('')
  }

  return (
    <div className="App">
      {alert}
      <Stepper />
        <Fragment>
          <div>
              {(!isLoggedIn && (
                <div>
                    <Input
                    disabled={loggingIn}
                    onChange={e => setName(e.target.value)}
                    placeholder="Username..."
                    />
                    <Button
                    type="primary"
                    disabled={!name || loggingIn}
                    onClick={handleLogin}
                    >
                    Login
                    </Button>
                </div>
              )) || (
                <Card>
                  Logged In as: {name}
                </Card>
              )}
          </div>

          <div class="card">
              <div class="flex flex-nowrap overflow-hidden card-container green-container">
                  <div class="flex align-items-center justify-content-center bg-green-500 font-bold text-white m-2 border-round"
                  >
                  <UsersList
                    users={users}
                    toggleConnection={toggleConnection}
                    connectedTo={connectedTo}
                    connection={connecting}
                  />
                  </div>
                  <div class="flex align-items-center justify-content-center bg-green-500 font-bold text-white m-2 border-round"
                  >
                  <MessageBox
                    messages={messages}
                  />
                  </div>
              </div>
          </div>
        </Fragment>
    </div>
  );
};

export default ChatBox;
