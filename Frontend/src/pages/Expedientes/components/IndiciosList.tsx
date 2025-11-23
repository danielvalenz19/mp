import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import { getIndiciosByExpediente, deleteIndicio, createIndicio, updateIndicio, type Indicio } from '../../../services/indiciosService';

interface Props {
  expedienteId: number;
  isEditable: boolean; // Solo true si es BORRADOR o RECHAZADO
}

const IndiciosList = ({ expedienteId, isEditable }: Props) => {
  const [indicios, setIndicios] = useState<Indicio[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicio, setEditingIndicio] = useState<Indicio | null>(null);
  const [form, setForm] = useState({ descripcion: '', color: '', tamano: '', peso: '', ubicacion: '' });

  const cargarIndicios = async () => {
    setLoading(true);
    try {
      const data = await getIndiciosByExpediente(expedienteId);
      setIndicios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIndicios();
  }, [expedienteId]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar indicio?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        await deleteIndicio(id);
        Swal.fire('Eliminado', 'El indicio ha sido eliminado.', 'success');
        cargarIndicios();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar.', 'error');
      }
    }
  };

  const handleOpenModal = (indicio?: Indicio) => {
    if (indicio) {
      setEditingIndicio(indicio);
      setForm({
        descripcion: indicio.descripcion,
        color: indicio.color || '',
        tamano: indicio.tamano || '',
        peso: indicio.peso?.toString() || '',
        ubicacion: indicio.ubicacion || ''
      });
    } else {
      setEditingIndicio(null);
      setForm({ descripcion: '', color: '', tamano: '', peso: '', ubicacion: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, peso: Number(form.peso) };
      if (editingIndicio) {
        await updateIndicio(editingIndicio.id, payload);
      } else {
        await createIndicio(expedienteId, payload);
      }
      setIsModalOpen(false);
      cargarIndicios();
      Swal.fire('Guardado', 'Indicio registrado correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar', 'error');
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Evidencias Recolectadas ({indicios.length})
        </h3>
        {isEditable && (
          <button onClick={() => handleOpenModal()} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition flex items-center gap-2">
            <Plus className="w-4 h4" /> Agregar Indicio
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Color</th>
              <th className="px-6 py-3">Tamaño</th>
              <th className="px-6 py-3">Ubicación</th>
              {isEditable && <th className="px-6 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {indicios.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-medium text-slate-700">{item.descripcion}</td>
                <td className="px-6 py-3 text-slate-500">{item.color || '-'}</td>
                <td className="px-6 py-3 text-slate-500">{item.tamano || '-'}</td>
                <td className="px-6 py-3 text-slate-500">{item.ubicacion || '-'}</td>
                {isEditable && (
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:text-blue-700 mr-3"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </td>
                )}
              </tr>
            ))}
            {indicios.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No hay indicios registrados aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Flotante Simplificado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">{editingIndicio ? 'Editar Indicio' : 'Nuevo Indicio'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Descripción del objeto" className="w-full p-2 border rounded" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Color" className="w-full p-2 border rounded" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
                <input placeholder="Tamaño" className="w-full p-2 border rounded" value={form.tamano} onChange={e => setForm({...form, tamano: e.target.value})} />
              </div>
              <input placeholder="Ubicación" className="w-full p-2 border rounded" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiciosList;
