import { useEffect, useState } from 'react';
import { Plus, Edit2, Key, Power, Shield, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchUsuarios, changeEstado, type Usuario } from '../../services/usuariosService';
import UsuarioForm from './components/UsuarioForm';
import PasswordModal from './components/PasswordModal';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [showForm, setShowForm] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleEstado = async (user: Usuario) => {
    const nuevoEstado = user.estado === 1 ? 0 : 1;
    const action = nuevoEstado === 1 ? 'activar' : 'desactivar';
    
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} usuario?`,
      text: `Vas a ${action} el acceso a ${user.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? '#22c55e' : '#ef4444',
      confirmButtonText: `Sí, ${action}`
    });

    if (result.isConfirmed) {
      try {
        await changeEstado(user.id, nuevoEstado);
        loadData();
        Swal.fire('Listo', `Usuario ${nuevoEstado === 1 ? 'activado' : 'desactivado'}`, 'success');
      } catch (e) {
        Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
      }
    }
  };

  const openEdit = (u: Usuario) => {
    setSelectedUser(u);
    setShowForm(true);
  };

  const openCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const openPass = (u: Usuario) => {
    setSelectedUser(u);
    setShowPass(true);
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
          <p className="text-slate-500 text-sm">Administración de personal y accesos</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={openCreate} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition whitespace-nowrap">
            <Plus className="w-5 h-5" /> <span className="hidden md:inline">Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 bg-slate-50">Usuario</th>
                <th className="px-6 py-4 bg-slate-50">Rol</th>
                <th className="px-6 py-4 bg-slate-50">Estado</th>
                <th className="px-6 py-4 bg-slate-50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Cargando...</td></tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">No se encontraron usuarios que coincidan con la búsqueda.</td></tr>
              ) : filteredUsuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{u.nombre}</div>
                    <div className="text-xs text-slate-400">{u.correo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                      <Shield className="w-3 h-3" /> {u.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => openPass(u)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg" title="Cambiar contraseña">
                      <Key className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="Editar datos">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleEstado(u)} className={`p-2 rounded-lg ${u.estado === 1 ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`} title={u.estado === 1 ? 'Desactivar' : 'Activar'}>
                      <Power className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UsuarioForm isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={loadData} usuarioToEdit={selectedUser} />
      <PasswordModal isOpen={showPass} onClose={() => setShowPass(false)} usuario={selectedUser} />
    </div>
  );
};

export default UsuariosList;
