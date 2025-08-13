import React, { useEffect, useState } from 'react';

interface SolicitudBeca {
  ID_SOLICITUD_BECA: number;
  ID_ESTUDIANTE: number;
  Estudiante: string;
  NUMERO_MATRICULA: string;
  NOMBRE_BECA: string;
  MONTO: number;
  JUSTIFICACION: string;
  Estado_Solicitud: string;
  FECHA_SOLICITUD: string;
  OBSERVACIONES: string;
}

export default function GestionSolicitudesBecas() {
  const [solicitudes, setSolicitudes] = useState<SolicitudBeca[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [justificacion, setJustificacion] = useState('');
  const [becaSeleccionada, setBecaSeleccionada] = useState<number | null>(null);

  // Obtener solicitudes
  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/estudiante/solicitudes-beca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operacion: 'R' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar solicitudes');
      setSolicitudes(data.data || []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear solicitud de beca
  const crearSolicitud = async () => {
    if (!becaSeleccionada || !justificacion.trim()) {
      alert('Debes seleccionar una beca y escribir la justificación');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/estudiante/solicitudes-beca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operacion: 'C',
          ID_BECA: becaSeleccionada,
          JUSTIFICACION: justificacion
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear solicitud');
      alert(data.data?.Mensaje || 'Solicitud creada con éxito');
      setShowModal(false);
      setJustificacion('');
      setBecaSeleccionada(null);
      fetchSolicitudes();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Determinar si hay beca aprobada
  const tieneBecaActiva = solicitudes.some(s => s.Estado_Solicitud === 'Aprobada');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Becas</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        className="mb-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
        onClick={() => setShowModal(true)}
        disabled={tieneBecaActiva || loading}
      >
        {tieneBecaActiva ? 'Ya tienes una beca activa' : 'Solicitar Beca'}
      </button>

      {loading && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Cargando...
        </div>
      )}

      {/* Tabla de solicitudes */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Beca</th>
              <th className="px-4 py-2 border-b">Monto</th>
              <th className="px-4 py-2 border-b">Justificación</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Observaciones</th>
              <th className="px-4 py-2 border-b">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hay solicitudes
                </td>
              </tr>
            ) : (
              solicitudes.map(s => (
                <tr key={s.ID_SOLICITUD_BECA} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{s.ID_SOLICITUD_BECA}</td>
                  <td className="px-4 py-2 border-b">{s.NOMBRE_BECA}</td>
                  <td className="px-4 py-2 border-b">{s.MONTO}</td>
                  <td className="px-4 py-2 border-b">{s.JUSTIFICACION}</td>
                  <td className="px-4 py-2 border-b">{s.Estado_Solicitud}</td>
                  <td className="px-4 py-2 border-b">{s.OBSERVACIONES || '-'}</td>
                  <td className="px-4 py-2 border-b">{new Date(s.FECHA_SOLICITUD).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Solicitar Beca</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Selecciona la Beca</label>
              <select
                value={becaSeleccionada ?? ''}
                onChange={e => setBecaSeleccionada(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Selecciona una beca --</option>
                <option value={1}>Beca Académica</option>
                <option value={2}>Beca Deportiva</option>
                <option value={3}>Beca Cultural</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Justificación</label>
              <textarea
                value={justificacion}
                onChange={e => setJustificacion(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={crearSolicitud}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
