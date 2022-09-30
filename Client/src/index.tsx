import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import authConfig from './authConfig';

const msalInstance = new PublicClientApplication(authConfig.msal);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <MsalProvider instance={msalInstance}>
          <App />
      </MsalProvider>
  </React.StrictMode>,
);
