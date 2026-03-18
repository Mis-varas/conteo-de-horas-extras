import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <Home size={24} />, label: 'Inicio' },
    { path: '/asignacion', icon: <Calendar size={24} />, label: 'Turnos' },
    { path: '/funcionarios', icon: <Users size={24} />, label: 'Staff' },
    { path: '/reportes', icon: <BarChart3 size={24} />, label: 'Reportes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 pb-6 flex justify-between items-center z-50">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-blue-600 scale-110' : 'text-gray-400'
            }`}
          >
            <div className={`${isActive ? 'bg-blue-50 p-2 rounded-xl' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;