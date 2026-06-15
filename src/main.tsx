import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Registriraj service worker (PWA instalabilnost + offline app-shell).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
