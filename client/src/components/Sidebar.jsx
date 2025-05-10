import { Link, useLocation } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { to: "/dashboard/clasificacion", label: "Configuración", icon: <FaClipboardList className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-72 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white flex-shrink-0 p-6 shadow-lg">
      <div className="mb-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Control del sistema
        </h2>
        <div className="h-1 w-20 bg-blue-500 mt-2 rounded-full"></div>
      </div>
      
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === link.to
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:translate-x-1'
            }`}
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
