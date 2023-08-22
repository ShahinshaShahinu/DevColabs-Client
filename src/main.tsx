import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store, persistor } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider  store={Store}>
    <GoogleOAuthProvider clientId='1092413293944-0nma9o1743q1bua00g0o0con09jch7kt.apps.googleusercontent.com'>
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </PersistGate>
    </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
)
