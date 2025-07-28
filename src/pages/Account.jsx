// src/pages/Account.jsx
import React, { useEffect } from 'react';

export default function Account() {
  useEffect(() => {
    const user = localStorage.getItem('tew-user');
    if (!user) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to Your Account</h2>
      <p>View your past orders and manage account info here.</p>
    </div>
  );
}
