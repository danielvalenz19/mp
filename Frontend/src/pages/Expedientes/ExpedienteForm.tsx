import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchDependencias, type CatalogoItem } from '../../services/catalogosService';
import {
  createExpediente,
  fetchExpedientes,
  updateExpediente,
} from '../../services/expedientesService';

const ExpedienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [dependencias, setDependencias] = useState<CatalogoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    idDependencia: '',
  });

  const loadDependencias = async () => {
    try {
      const data = await fetchDependencias();
      setDependencias(data);
    } catch (err) {
      Swal.fire('Error', 'No se pudieron cargar las dependencias', 'error');
    }
  };

  const loadExpediente = async (expedienteId: number) => {
    setLoading(true);
    try {
      const data = await fetchExpedientes();
      const found = data.find((x) => x.id_expediente === expedienteId);
      if (found) {
        setForm({
          titulo: found.titulo,
          descripcion: found.descripcion ?? '',
          idDependencia: String(found.id_dependencia ?? ''),
        });
      } else {
        Swal.fire('Atencion', 'No se encontro el expediente', 'warning');
      }
    } catch (err) {
      Swal.fire('Error', 'No se pudo cargar el expediente', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDependencias();
    if (isEdit && id) {
      loadExpediente(Number(id));
    }
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.idDependencia) {
      Swal.fire('Campos incompletos', 'Completa todos los campos', 'warning');
      return;
    }
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateExpediente(Number(id), {
          titulo: form.titulo,
          descripcion: form.descripcion,
          idDependencia: Number(form.idDependencia),
        });
        Swal.fire('Actualizado', 'Expediente actualizado', 'success');
      } else {
        await createExpediente({
          titulo: form.titulo,
          descripcion: form.descripcion,
          idDependencia: Number(form.idDependencia),
        });
        Swal.fire('Creado', 'Expediente creado', 'success');
      }
      navigate('/expedientes');
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el expediente', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {isEdit ? 'Editar expediente' : 'Nuevo expediente'}
          </h1>
          <p className="text-slate-500 text-sm">
            Completa la informacion del caso y asigna la dependencia.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Titulo</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            placeholder="Titulo del expediente"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Descripcion</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            rows={4}
            placeholder="Describe brevemente el caso"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Dependencia</label>
          <select
            value={form.idDependencia}
            onChange={(e) => setForm({ ...form, idDependencia: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          >
            <option value="">Selecciona dependencia</option>
            {dependencias.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/expedientes')}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpedienteForm;
