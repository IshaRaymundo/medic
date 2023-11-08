import React from 'react';

const Navbar = () => {
  const handleLogout = () => {
    
  };

  return (
    <nav className="bg-blue-950 p-2">
      <div className="container mx-auto flex justify-between items-center">
        <a className="text-white text-2xl font-bold no-underline" href="/">MedicApp</a>
        <ul className="flex items-center">
          <li className="ml-4">
            <button className="bg-blue-400 text-white px-4 py-2 rounded-lg" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
