import React from "react";
import Chat from "@components/ChatBox";
import { AppProvider } from '@context/AppContext';
import { SocketProvider } from "@context/SocketContext";
import { UsersProvider } from "@context/UsersContext";

const Container = () => {
  return (
    <AppProvider>
      <UsersProvider>
        <SocketProvider>
          <Chat
            connection={connection}
            updateConnection={updateConnection}
            channel={channel}
            updateChannel={updateChannel}
          />
        </SocketProvider>
      </UsersProvider>
    </AppProvider>
  );
};
export default Container
