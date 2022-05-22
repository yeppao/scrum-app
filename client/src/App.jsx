import React from 'react';
import Layout from '@components/Layout/Layout';
import { AppProvider } from '@context/AppContext';
import { UsersProvider } from '@context/UsersContext';
import { SocketProvider } from '@context/SocketContext';
import { RoomProvider } from '@context/RoomContext';
import Chat from '@pages/Chat';
import Default from '@pages/Default';
import Login from '@pages/Login';
import Projects from '@pages/Projects';
import Groups from '@pages/Groups';
import Work from '@pages/Work';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import './App.scss';
import Issues from '@pages/Issues';
import { SprintProvider } from '@context/SprintContext';


import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons


const App = () => {
  return (
    <AppProvider>
      <UsersProvider>
        <SocketProvider>
          <RoomProvider>
            <SprintProvider>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/projects' element={<Projects />} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/groups' element={<Groups />} />
                    <Route path='/work/:groupId' element={<Work />} />
                    <Route path='/issues/:sprintId' element={<Issues />} />
                    <Route element={<Default />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </SprintProvider>
          </RoomProvider>
        </SocketProvider>
      </UsersProvider>
    </AppProvider>
  );
};

export default App;
