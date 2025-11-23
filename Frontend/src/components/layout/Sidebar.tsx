import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Users, LogOut, FileBarChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  // Normalizamos el rol para que no falle si viene como 'rol' o 'rol_nombre'
  const userRole = (user as any)?.rol || (user as any)?.rol_nombre || '';

  // Menú de navegación
  const links = [
    { 
      name: 'Dashboard', 
      to: '/dashboard', 
      icon: LayoutDashboard, 
      roles: ['ADMIN', 'COORDINADOR', 'TECNICO'] 
    },
    { 
      name: 'Expedientes', 
      to: '/expedientes', 
      icon: FolderOpen, 
      roles: ['ADMIN', 'COORDINADOR', 'TECNICO'] 
    },
    // 👇 ESTE ES EL QUE FALTABA
    { 
      name: 'Usuarios', 
      to: '/usuarios', 
      icon: Users, 
      roles: ['ADMIN', 'COORDINADOR'] 
    },
    { 
      name: 'Reportes', 
      to: '/reportes', 
      icon: FileBarChart, 
      roles: ['ADMIN', 'COORDINADOR'] 
    },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-sidebar text-white flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 font-bold text-xl tracking-wide border-b border-white/10">
        SGE <span className="text-primary ml-1">DICRI</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => {
          // Si el rol del usuario NO está en la lista permitida, no mostramos el botón
          if (!link.roles.includes(userRole)) return null;

          return (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 
                ${isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
