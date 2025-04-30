import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { to: "/dashboard/clasificacion", label: "Clasificaciones" },

  ];

  return (
    <aside className="w-64 h-full bg-gray-800 text-white flex-shrink-0 p-6">
      <h2 className="text-2xl font-bold mb-10">Control del sistema</h2>
      <nav className="flex flex-col gap-4">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-md transition ${
              location.pathname === link.to
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
