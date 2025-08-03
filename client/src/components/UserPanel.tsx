import React, { useEffect } from 'react';
import type { User } from '../types';

interface UserPanelProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ currentUser, setCurrentUser }) => {
  useEffect(() => {
    if (!currentUser) {
      const saved = localStorage.getItem('currentUser');
      if (saved) setCurrentUser(JSON.parse(saved));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
    console.log('currentUser:', currentUser);
  }, [currentUser]);

  const handleAddUser = async () => {
    const userName = prompt('הכנס שם משתמש חדש, שם המשתמש יכול להכיל אותיות באנגלית ומספרים בלבד:');
    if (!userName) return;
    const id = crypto.randomUUID();
    const res = await fetch('http://localhost:5042/api/Users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userName })
    });
    if (res.ok) {
      const user = await res.json();
      if (user && user.userName) {
        setCurrentUser(user);
      }
    } else if (res.status === 400) {
      const getRes = await fetch(`http://localhost:5042/api/Users/by-username/${encodeURIComponent(userName)}`);
      if (getRes.ok) {
        let user = await getRes.json();
        if (user && user.userName) {
          setCurrentUser(user);
        } else {
          alert('User not found');
        }
      } else {
        alert('Error logging in with existing user');
      }
    } else {
      alert('Error creating user');
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ color: 'black', fontSize: 16, marginLeft: 12 }}>
        משתמש נוכחי: {currentUser ? currentUser.userName : 'לא מחובר'}
      </span>
      <button style={{ marginRight: 12 }} onClick={handleAddUser}>
        הרשמה/התחברות
      </button>
    </div>
  );
};

export default UserPanel;