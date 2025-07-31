import React, { useEffect } from 'react';
import type { User } from '../types';

interface UserPanelProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ currentUser, setCurrentUser }) => {
  // טען משתמש מה-localStorage כשנטען הדף
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setCurrentUser(JSON.parse(saved));
    // eslint-disable-next-line
  }, []);

  const handleAddUser = async () => {
    const userName = prompt('הכנס שם משתמש חדש, שם המשתמש יכול להכיל אותיות באנגלית ומספרים בלבד:');
    if (!userName){ return; } 
    // יצירת מזהה ייחודי חדש
    const id = crypto.randomUUID();
    console.log(`User ID: ${id}`);
    const res = await fetch('http://localhost:5042/api/Users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userName })
    });
    if (res.ok) {
      const user = await res.json();
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      alert('שגיאה ביצירת משתמש');
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