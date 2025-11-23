import { useState, useEffect } from 'react';
import { X, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchRoles, type CatalogoItem } from '../../../services/catalogosService';
import { createUsuario, updateUsuario, type Usuario } from '../../../services/usuariosService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuarioToEdit?: Usuario | null;
}

const UsuarioForm = ({ isOpen, onClose, onSuccess, usuarioToEdit }: Props) => {
  const [roles, setRoles] = useState<CatalogoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '', // Solo para crear
    idRol: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchRoles().then(setRoles).catch(console.error);
      if (usuarioToEdit) {
        setForm({
          nombre: usuarioToEdit.nombre,
          correo: usuarioToEdit.correo,
          password: '', // No se edita aquí
          idRol: String(usuarioToEdit.id_rol)
        });
      } else {
        setForm({ nombre: '', correo: '', password: '', idRol: '' });
      }
    }
  }, [isOpen, usuarioToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (usuarioToEdit) {
        // Editar (sin password)
        await updateUsuario(usuarioToEdit.id, {
          nombre: form.nombre,
          correo: form.correo,
          idRol: Number(form.idRol)
        });
        Swal.fire('Actualizado', 'Datos del usuario modificados', 'success');
      } else {
        // Crear (con password)
        await createUsuario({
          nombre: form.nombre,
          correo: form.correo,
          password: form.password,
          idRol: Number(form.idRol)
        });
        Swal.fire('Creado', 'Usuario registrado exitosamente', 'success');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Hubo un problema', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">{usuarioToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Nombre Completo</label>
            <input required type="text" className="w-full p-2 border rounded-lg text-sm"
              value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700">Correo Electrónico</label>
            <input required type="email" className="w-full p-2 border rounded-lg text-sm"
              value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} />
          </div>

          {!usuarioToEdit && (
            <div>
              <label className="text-sm font-medium text-slate-700">Contraseña Inicial</label>
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  className="w-full p-2 border rounded-lg text-sm pr-10"
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700">Rol</label>
            <select required className="w-full p-2 border rounded-lg text-sm bg-white"
              value={form.idRol} onChange={e => setForm({...form, idRol: e.target.value})}>
              <option value="">-- Seleccione --</option>
              {roles.map(rol => <option key={rol.id} value={rol.id}>{rol.nombre}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;
