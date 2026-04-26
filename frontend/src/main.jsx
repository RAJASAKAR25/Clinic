import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4500,
          style: {
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: {
            style: { background: '#1e40af', color: '#fff' },
            iconTheme: { primary: '#60a5fa', secondary: '#1e40af' },
          },
          error: {
            style: { background: '#dc2626', color: '#fff' },
            iconTheme: { primary: '#fca5a5', secondary: '#dc2626' },
          },
        }}
      />
    </HelmetProvider>
  </React.StrictMode>
);
