import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store, persistor } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './Context/WebsocketContext.tsx';
import { PeerProvider } from './Provider/Peer.tsx';




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
      <SocketProvider>
        <PeerProvider >
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLECLIENTID} >
            <PersistGate loading={null} persistor={persistor}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </PersistGate>
          </GoogleOAuthProvider>
        </PeerProvider>
      </SocketProvider>
    </Provider>
  </React.StrictMode>
)











// clientId='1092413293944-0nma9o1743q1bua00g0o0con09jch7kt.apps.googleusercontent.com'>