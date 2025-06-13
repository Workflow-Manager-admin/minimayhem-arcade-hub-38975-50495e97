import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// No usage of PUBLIC_URL here – no further changes necessary in entrypoint
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
