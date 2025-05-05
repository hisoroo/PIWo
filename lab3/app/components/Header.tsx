import React, { useState, useEffect } from 'react';
import { login, logout } from '../services/UserService.tsx';
import { auth } from '../services/firebase.js';
import { onAuthStateChanged, User } from 'firebase/auth';

const Header = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-950 shadow-sm font-sans">
      <div className="flex-1" />
      <h1 className="flex-1 text-center text-3xl font-extrabold tracking-tight text-white select-none">
        księgarnia
      </h1>
      <div className="flex flex-1 justify-end gap-3 items-center">
        <button className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition-colors duration-150 border border-gray-800">
          koszyk
        </button>
        {currentUser ? (
          <button
            onClick={logout}
            title="Wyloguj się"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition-colors duration-150 border border-gray-800"
          >
            <img
              src={currentUser.photoURL || undefined}
              alt="User profile"
              className="w-6 h-6 rounded-full border border-gray-700"
            />
            <span>wyloguj</span>
          </button>
        ) : (
          <button onClick={login} className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition-colors duration-150 border border-gray-800">
            zaloguj się
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
