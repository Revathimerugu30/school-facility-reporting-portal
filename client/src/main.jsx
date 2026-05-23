import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ToastContainer } from './components/Toast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App />
        <ToastContainer />
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
