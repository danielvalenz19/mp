import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Send, FileText, History } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { fetchExpedienteById, type Expediente } from '../../services/expedientesService';
import IndiciosList from './components/IndiciosList';
import api from '../../services/api'; // Para las llamadas PATCH directas

const ExpedienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchExpedienteById(Number(id));
      setExpediente(data);
    } catch (error) {
      navigate('/expedientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  if (!expediente || loading) return <div className="p-8 text-center">Cargando...</div>;

  const isEditable = expediente.estado_codigo === 'BORRADOR' || expediente.estado_codigo === 'RECHAZADO';
  const isRevision = expediente.estado_codigo === 'EN_REVISION';
  
  // 🔴 CORRECCIÓN CRÍTICA: Validar rol o rol_nombre
  const currentRole = (user as any)?.rol || (user as any)?.rol_nombre;
  const isCoordinador = currentRole === 'COORDINADOR' || currentRole === 'ADMIN';

  // --- ACCIONES DE FLUJO ---

  const handleEnviarRevision = async () => {
    try {
      await api.patch(`/expedientes/${id}/enviar-revision`);
      Swal.fire('Enviado', 'El expediente ha pasado a revisión', 'success');
      loadData();
    } catch (e) { Swal.fire('Error', 'No se pudo enviar', 'error'); }
  };

  const handleAprobar = async () => {
    try {
      await api.patch(`/expedientes/${id}/aprobar`);
      Swal.fire('Aprobado', 'Expediente cerrado exitosamente', 'success');
      loadData();
    } catch (e) { Swal.fire('Error', 'No se pudo aprobar', 'error'); }
  };

  const handleRechazar = async () => {
    const { value: text } = await Swal.fire({
      title: 'Motivo de Rechazo',
      input: 'textarea',
      inputPlaceholder: 'Escribe la justificación...',
      showCancelButton: true
    });

    if (text) {
      try {
        await api.patch(`/expedientes/${id}/rechazar`, { justificacion: text });
        Swal.fire('Rechazado', 'El expediente ha sido devuelto', 'info');
        loadData();
      } catch (e) { Swal.fire('Error', 'No se pudo rechazar', 'error'); }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Navegación */}
      <button onClick={() => navigate('/expedientes')} className="flex items-center text-slate-500 hover:text-primary transition mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la lista
      </button>

      {/* Tarjeta Principal */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{expediente.codigo}</span>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">{expediente.titulo}</h1>
            <p className="text-slate-500 mt-2">{expediente.descripcion || 'Sin descripción adicional'}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
              expediente.estado_codigo === 'APROBADO' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
              expediente.estado_codigo === 'RECHAZADO' ? 'bg-rose-100 text-rose-700 border-rose-200' :
              'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {expediente.estado_descripcion}
            </span>
            <p className="text-xs text-slate-400 mt-2">Dependencia: {expediente.dependencia}</p>
          </div>
        </div>

        {/* Barra de Acciones */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
          {isEditable && (
            <button onClick={handleEnviarRevision} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Send className="w-4 h-4" /> Enviar a Revisión
            </button>
          )}
          
          {/* Botones para el Coordinador (SOLO si está en revisión) */}
          {isRevision && isCoordinador && (
            <>
              <button onClick={handleRechazar} className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                <XCircle className="w-4 h-4" /> Rechazar
              </button>
              <button onClick={handleAprobar} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-4 h-4" /> Aprobar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lista de Indicios */}
      <IndiciosList expedienteId={Number(id)} isEditable={isEditable} />

      {/* Sección de Historial (Opcional visualmente) */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-2">
          <History className="w-4 h-4" /> Auditoría
        </h4>
        <p className="text-xs text-slate-500">
          Creado por {expediente.tecnico_nombre} el {new Date(expediente.fecha_registro).toLocaleDateString()}.
        </p>
      </div>
    </div>
  );
};

export default ExpedienteDetail;
