import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-950 shadow-sm font-sans">
      <div className="flex-1" />
      <h1 className="flex-1 text-center text-3xl font-extrabold tracking-tight text-white select-none">
        księgarnia
      </h1>
      <div className="flex flex-1 justify-end gap-3">
        <button className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition-colors duration-150 border border-gray-800">
          koszyk
        </button>
        <button className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition-colors duration-150 border border-gray-800">
          zaloguj się
        </button>
      </div>
    </header>
  );
};

export default Header;
