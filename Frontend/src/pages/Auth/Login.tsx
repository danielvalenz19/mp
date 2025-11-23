import { useState } from 'react';
import type { FormEvent } from 'react';
import Swal from 'sweetalert2';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginService } from '../../services/authService';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!correo || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacios',
        text: 'Por favor ingresa tu correo y contrasena',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await loginService(correo, password);
      const { accessToken, user } = response;
      login(accessToken, user);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: `Bienvenido, ${String((user as { nombre?: string })?.nombre ?? '')}`.trim() || 'Bienvenido',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err.response?.data?.message || 'Error al conectar con el servidor';
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: msg,
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">SGE - DICRI</h1>
          <p className="text-slate-500 text-sm mt-2">Sistema de Gestion de Evidencias</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              placeholder="Correo electronico"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-700"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contrasena"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 flex justify-center items-center disabled:opacity-80"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Iniciando...
              </>
            ) : (
              'Iniciar Sesion'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">Ministerio Publico de Guatemala &copy; 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
