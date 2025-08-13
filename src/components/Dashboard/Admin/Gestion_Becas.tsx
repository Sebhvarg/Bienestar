import React, { useEffect, useState } from 'react';

interface SolicitudBeca {
  ID_SOLICITUD: number;
  ID_ESTUDIANTE: number;
  ESTUDIANTE: string;
  ID_BECA: number;
  BECA: string;
  JUSTIFICACION: string;
  ESTADO: 'Pendiente' | 'Aprobado' | 'Rechazado';
  ID_ADMIN?: number;
  OBSERVACIONES?: string;
}

export default function GestionBecas() {
  const [solicitudes, setSolicitudes] = useState<SolicitudBeca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ ESTADO: 'Aprobado' | 'Rechazado'; OBSERVACIONES?: string }>({ ESTADO: 'Aprobado' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/becas');
      const data = await res.json();
      setSolicitudes(data.data || []);
      setError(null);
    } catch {
      setError('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSolicitudes(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (solicitud: SolicitudBeca) => {
    setEditingId(solicitud.ID_SOLICITUD);
    setForm({ ESTADO: 'Aprobado', OBSERVACIONES: solicitud.OBSERVACIONES || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await fetch(`http://localhost:4000/api/admin/becas/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: form.ESTADO, idAdmin: 1, observaciones: form.OBSERVACIONES }),
      });
      setShowModal(false);
      fetchSolicitudes();
    } catch {
      setError('Error al actualizar solicitud');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar solicitud?')) return;
    try {
      await fetch(`http://localhost:4000/api/admin/becas/${id}`, { method: 'DELETE' });
      fetchSolicitudes();
    } catch {
      setError('Error al eliminar solicitud');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Becas</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? <p>Cargando...</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Beca</th>
              <th>Justificación</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(s => (
              <tr key={s.ID_SOLICITUD} className="hover:bg-gray-50">
                <td>{s.ESTUDIANTE}</td>
                <td>{s.BECA}</td>
                <td>{s.JUSTIFICACION}</td>
                <td>{s.ESTADO}</td>
                <td>{s.OBSERVACIONES || '-'}</td>
                <td>
                  <button onClick={() => openModal(s)} className="text-green-600 mr-2">Aprobar/Rechazar</button>
                  <button onClick={() => handleDelete(s.ID_SOLICITUD)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Actualizar Solicitud</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select name="ESTADO" value={form.ESTADO} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
              <textarea
                name="OBSERVACIONES"
                value={form.OBSERVACIONES}
                onChange={handleChange}
                placeholder="Observaciones"
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
