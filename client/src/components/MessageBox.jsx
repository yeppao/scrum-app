import React, { useState, useContext, useEffect, useCallback } from 'react';

import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Editor } from 'primereact/editor';
import { Tooltip } from 'primereact/tooltip';
import moment from 'moment';
import { SocketContext } from '@context/SocketContext';
import { AppContext } from '@context/AppContext';
import { RoomContext } from '@context/RoomContext';

const avatar = 'https://joeschmoe.io/api/v1/random';

const MessageBox = () => {
  const { selectedRoom, roomsMessages } = useContext(AppContext);
  const { rooms } = useContext(RoomContext);
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const currentMessages = roomsMessages[selectedRoom] ? roomsMessages[selectedRoom].map((msg, i) => ({
      actions: [<span key={`comment-list-like-${i}`}>Reply to</span>],
      author: msg.user,
      avatar: (<Avatar src={avatar} />),
      content: msg.text,
      datetime: (
        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment().fromNow()}</span>
        </Tooltip>
      )
    })) : [];

    setMessages(currentMessages);
  }, [roomsMessages, selectedRoom]);

  const handleSendMessage = useCallback(() => {
    const data = {
      message: message,
      roomId: selectedRoom
    };

    socket.emit('sendMessage', data);
    setMessage('');
  }, [socket, message, selectedRoom]);

  return (
    <div>
      <Card
        title={`Room ${selectedRoom} with ${rooms[selectedRoom]?.participants ?? 'everyone'}`}
        bordered={false}
        style={{ width: '100%' }}
      >
        {messages.length ? (
          <div>
            {messages.map(item => (
              <div>
                  {item.actions}
                  {item.author}
                  {item.avatar}
                  {item.content}
                  {item.datetime}
                  <Divider />
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-0 text-700 text-center">
            <div className="text-blue-600 font-bold mb-3"><i className="pi pi-check-circle"></i>&nbsp;Success</div>
            <div className="text-900 font-bold text-5xl mb-3">Successfully in chat</div>
            <div className="text-700 text-2xl mb-5">Wait for the others to begin</div>
          </div>
        )}
        <Editor
          showCount
          value={message}
          placeholder='Enter Message'
          onChange={e => setMessage(e.target.value)}
        />
        <Button type="primary" key="send" disabled={message === '' ? true : false} onClick={handleSendMessage}>
          Send Message
        </Button>
      </Card>
    </div>
  );
};

export default MessageBox;
