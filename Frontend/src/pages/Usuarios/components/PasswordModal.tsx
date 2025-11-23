import { useState } from 'react';
import { X, Key, Loader2, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { changePassword, type Usuario } from '../../../services/usuariosService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

const PasswordModal = ({ isOpen, onClose, usuario }: Props) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    
    setLoading(true);
    try {
      await changePassword(usuario.id, password);
      Swal.fire('Listo', 'Contraseña actualizada correctamente', 'success');
      setPassword('');
      onClose();
    } catch (error) {
      Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !usuario) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" /> Cambiar Contraseña
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        
        <p className="text-sm text-slate-500 mb-4">
          Nueva contraseña para: <strong>{usuario.nombre}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              required 
              type={showPassword ? "text" : "password"} 
              placeholder="Escribe la nueva contraseña" 
              className="w-full p-2 border rounded-lg pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex justify-center items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Actualizar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
