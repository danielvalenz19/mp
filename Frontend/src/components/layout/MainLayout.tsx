import { useEffect, useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchCurrentUser } from '../../services/authService';

const MainLayout = () => {
  const { user, isAuthenticated, logout, setUserData } = useAuth();
  const location = useLocation();
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    let active = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && !user) {
      setLoadingUser(true);
      fetchCurrentUser()
        .then((data) => {
          if (active) {
            setUserData(data);
          }
        })
        .catch(() => {
          if (active) {
            logout();
          }
        })
        .finally(() => {
          if (active) {
            setLoadingUser(false);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [user, setUserData, logout]);

  const hasToken =
    typeof window !== 'undefined' ? Boolean(localStorage.getItem('token')) : false;

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const displayName = (user as { nombre?: string })?.nombre ?? 'Usuario';
  const role =
    (user as { rol?: string })?.rol ??
    (user as { role?: string })?.role ??
    (user as { tipo?: string })?.tipo ??
    'Invitado';

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 bg-sidebar text-white flex-col">
        <div className="px-6 py-8 text-xl font-semibold tracking-wide border-b border-white/10">
          SGE DICRI
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
        </nav>
        <div className="px-4 py-6 border-t border-white/10">
          <button
            type="button"
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary/10 text-white py-2 rounded-lg text-sm hover:bg-primary/20 transition"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-500"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm text-slate-500">Hola,</p>
            <p className="text-lg font-semibold text-slate-800">{displayName}</p>
            <span className="inline-flex mt-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {role}
            </span>
          </div>
          <div className="hidden md:flex flex-col items-end text-sm text-slate-500">
            <span>{new Date().toLocaleDateString()}</span>
            <span className="text-slate-400 text-xs">Sesion activa</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {loadingUser ? (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Cargando perfil...
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
