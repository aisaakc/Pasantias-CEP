import { Link, useLocation } from 'react-router-dom';

export default function DashboardSidebar() {
  const location = useLocation(); // 🧠 saber la URL actual

  const links = [
    { to: "/dashboard/clasificacion", label: "Clasificaciones" },
    { to: "/dashboard/Hijos", label: "Otra sección" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white fixed h-full p-6 hidden lg:flex flex-col">
      <h2 className="text-2xl font-bold mb-10">Control del sistema</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-md transition ${location.pathname === link.to
                ? 'bg-gray-700 text-white'  // Estilo cuando está activo
                : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Estilo normal
              }`}
          >
            {link.label}
          </Link>
        ))}

      </nav>
    </aside>
  );
}
