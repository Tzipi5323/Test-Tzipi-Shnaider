import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => (
  <div
    style={{
      background: type === 'success' ? '#e8f5e9' : '#ffebee',
      color: type === 'success' ? '#388e3c' : '#d32f2f',
      border: type === 'success' ? '1.5px solid #388e3c' : '1.5px solid #d32f2f',
      borderRadius: 8,
      padding: '10px 16px',
      margin: '12px 0',
      textAlign: 'center',
      fontWeight: 500,
      fontSize: 16,
      boxShadow: '0 1px 4px #0001',
    }}
  >
    {message}
  </div>
);

export default Notification;
