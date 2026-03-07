// src/utils/keepAlive.js
// Pings the backend every 10 minutes to prevent Render free tier from sleeping

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tew-backend-kzs9.onrender.com';

export const startKeepAlive = () => {
  const ping = async () => {
    try {
      await fetch(`${BACKEND_URL}/`);
      console.log('✅ Keep-alive ping sent');
    } catch (err) {
      console.log('⚠️ Keep-alive ping failed:', err.message);
    }
  };

  // Ping immediately on load
  ping();

  // Then ping every 10 minutes
  const interval = setInterval(ping, 10 * 60 * 1000);

  return interval;
};