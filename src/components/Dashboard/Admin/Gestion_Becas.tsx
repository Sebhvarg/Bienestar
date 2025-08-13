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
  const [form, setForm] = useState<Partial<SolicitudBeca>>({});
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

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (solicitud?: SolicitudBeca) => {
    if (solicitud) {
      setEditingId(solicitud.ID_SOLICITUD);
      setForm({
        ESTADO: solicitud.ESTADO,
        OBSERVACIONES: solicitud.OBSERVACIONES || '',
      });
    } else {
      setEditingId(null);
      setForm({});
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:4000/api/admin/becas/${editingId}`
        : 'http://localhost:4000/api/admin/becas';
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId
        ? { estado: form.ESTADO, idAdmin: 1, observaciones: form.OBSERVACIONES } // idAdmin puede venir de sesión
        : { idEstudiante: form.ID_ESTUDIANTE, idBeca: form.ID_BECA, justificacion: form.JUSTIFICACION };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al guardar solicitud');
      setForm({});
      setEditingId(null);
      setShowModal(false);
      fetchSolicitudes();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar solicitud?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/becas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar solicitud');
      fetchSolicitudes();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Becas</h1>
      <button onClick={() => openModal()} className="mb-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
        Nueva Solicitud
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? <p>Cargando...</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Estudiante</th>
              <th className="px-4 py-2 border-b">Beca</th>
              <th className="px-4 py-2 border-b">Justificación</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Observaciones</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(s => (
              <tr key={s.ID_SOLICITUD} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{s.ESTUDIANTE}</td>
                <td className="px-4 py-2 border-b">{s.BECA}</td>
                <td className="px-4 py-2 border-b">{s.JUSTIFICACION}</td>
                <td className="px-4 py-2 border-b">{s.ESTADO}</td>
                <td className="px-4 py-2 border-b">{s.OBSERVACIONES || '-'}</td>
                <td className="px-4 py-2 border-b">
                  <button onClick={() => openModal(s)} className="text-blue-600 mr-2">Editar</button>
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
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-90vh overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Actualizar Solicitud' : 'Nueva Solicitud'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <>
                  <input
                    name="ID_ESTUDIANTE"
                    type="number"
                    value={form.ID_ESTUDIANTE || ''}
                    onChange={handleChange}
                    placeholder="ID Estudiante"
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  <input
                    name="ID_BECA"
                    type="number"
                    value={form.ID_BECA || ''}
                    onChange={handleChange}
                    placeholder="ID Beca"
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  <textarea
                    name="JUSTIFICACION"
                    value={form.JUSTIFICACION || ''}
                    onChange={handleChange}
                    placeholder="Justificación"
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </>
              )}

              {editingId && (
                <>
                  <select
                    name="estado"
                    value={form.ESTADO || 'Pendiente'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                  <textarea
                    name="observaciones"
                    value={form.OBSERVACIONES || ''}
                    onChange={handleChange}
                    placeholder="Observaciones"
                    className="w-full px-3 py-2 border rounded"
                  />
                </>
              )}

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setShowModal(false); setForm({}); setEditingId(null); setError(null); }} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
