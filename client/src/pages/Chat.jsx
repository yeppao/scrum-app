import React, { useCallback, useContext, useState } from 'react';
import MessageBox from '@components/MessageBox';
import { Button } from 'primereact/button';
import { PhoneFilled, VideoCameraFilled } from '@ant-design/icons';
import { SocketContext } from '@context/SocketContext';
import { UsersContext } from '@context/UsersContext';
import Media from '@components/Media/Media';

const Chat = () => {
  const { users } = useContext(UsersContext);
  const { streams, callPeer } = useContext(SocketContext);
  const [audioLaunched, setAudioLaunched] = useState(false);
  const [videoLaunched, setVideoLaunched] = useState(false);

  const toggleStreams = useCallback(() => {
    for (const user of users) {
      if (streams.filter(stream => stream.id === user.peerId).length === 0) {
        callPeer(user.peerId);
      }
    }

    setVideoLaunched(!videoLaunched);
    setAudioLaunched(!audioLaunched);
  }, [users, streams]);

  const loadStream = (peerId) => {
    callPeer(peerId);
  }

  return (
    <div>
      <div>
        <div>
          {users.map(user => <Button type="primary" onClick={() => loadStream(user.peerId)}>{user.name}</Button>)}
        </div>
        <div>
          <Button
            type="primary"
            shape="round"
            icon={<PhoneFilled />}
            onClick={toggleStreams}
            danger={audioLaunched}
          />
          <Button
            type="primary"
            shape="round"
            icon={<VideoCameraFilled />}
            onClick={toggleStreams}
            danger={videoLaunched}
          />
        </div>
        <pre>{JSON.stringify(users)}</pre>
        <pre>{JSON.stringify(streams)}</pre>
        <div id="video-grid">
          {streams.map((stream, index) => <Media key={index} type={'video'} stream={stream} />)}
        </div>
        <MessageBox />
      </div>
    </div>
  );
}

export default Chat;
