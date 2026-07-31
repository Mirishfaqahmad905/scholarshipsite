import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

const rawApiUrl = import.meta.env.VITE_API_URL;
if (
  rawApiUrl &&
  typeof rawApiUrl === 'string' &&
  (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://') || rawApiUrl.startsWith('/'))
) {
  axios.defaults.baseURL = rawApiUrl.replace(/\/+$/, '');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
