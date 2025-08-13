import React, { useEffect, useState } from 'react';

interface Actividad {
  ID_ACTIVIDAD?: number;
  NOMBRE_ACTIVIDAD: string;
  DESCRIPCION?: string;
  FECHA_HORA: string;
  CUPO_MAXIMO: number;
  UBICACION: string;
  TIPO_ACTIVIDAD: string;
  ESTADO?: string;
  ID_ADMINISTRADOR?: number;
}

export default function GestionActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Actividad, 'ID_ACTIVIDAD'>>({
    NOMBRE_ACTIVIDAD: '',
    DESCRIPCION: '',
    FECHA_HORA: '',
    CUPO_MAXIMO: 1,
    UBICACION: '',
    TIPO_ACTIVIDAD: '',
    ID_ADMINISTRADOR: undefined,
  });
  const [showModal, setShowModal] = useState(false);

  // Obtener lista de actividades
  const fetchActividades = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operacion: 'R' }),
      });
      if (!res.ok) throw new Error('Error al cargar actividades');
      const data = await res.json();
      // El backend devuelve data.data[0] como el array de actividades
      const actividades = Array.isArray(data.data) && Array.isArray(data.data[0]) ? data.data[0] : [];
      setActividades(actividades);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const openModal = (actividad?: Actividad) => {
    if (actividad) {
      setEditingId(actividad.ID_ACTIVIDAD ?? null);
      setForm({
        NOMBRE_ACTIVIDAD: actividad.NOMBRE_ACTIVIDAD,
        DESCRIPCION: actividad.DESCRIPCION || '',
        FECHA_HORA: actividad.FECHA_HORA ? new Date(actividad.FECHA_HORA).toISOString().slice(0, 16) : '',
        CUPO_MAXIMO: actividad.CUPO_MAXIMO,
        UBICACION: actividad.UBICACION,
        TIPO_ACTIVIDAD: actividad.TIPO_ACTIVIDAD,
        ID_ADMINISTRADOR: actividad.ID_ADMINISTRADOR,
      });
    } else {
      setEditingId(null);
      setForm({
        NOMBRE_ACTIVIDAD: '',
        DESCRIPCION: '',
        FECHA_HORA: '',
        CUPO_MAXIMO: 1,
        UBICACION: '',
        TIPO_ACTIVIDAD: '',
        ID_ADMINISTRADOR: 1, // Valor por defecto
      });
    }
    setShowModal(true);
    setError(null);
  };

  // Crear o actualizar actividad
  const saveActividad = async () => {
    try {
      setLoading(true);
      // Usar los nombres de campos que espera el SP y el backend
      const payload = {
        operacion: editingId ? 'U' : 'C',
        ID_ACTIVIDAD: editingId,
        NOMBRE_ACTIVIDAD: form.NOMBRE_ACTIVIDAD.trim(),
        DESCRIPCION: form.DESCRIPCION?.trim() || null,
        FECHA_HORA: form.FECHA_HORA,
        CUPO_MAXIMO: form.CUPO_MAXIMO,
        UBICACION: form.UBICACION.trim(),
        TIPO_ACTIVIDAD: form.TIPO_ACTIVIDAD.trim(),
        ID_ADMINISTRADOR: form.ID_ADMINISTRADOR || 1,
      };
      const res = await fetch('/api/admin/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al guardar actividad');
      }
      await fetchActividades();
      setShowModal(false);
      setEditingId(null);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar actividad
  const deleteActividad = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar esta actividad?')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operacion: 'D',
          ID_ACTIVIDAD: id,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al eliminar actividad');
      }
      await fetchActividades();
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!form.NOMBRE_ACTIVIDAD.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!form.FECHA_HORA) {
      setError('La fecha y hora son requeridas');
      return;
    }
    if (!form.UBICACION.trim()) {
      setError('La ubicación es requerida');
      return;
    }
    if (!form.TIPO_ACTIVIDAD.trim()) {
      setError('El tipo de actividad es requerido');
      return;
    }
    if (form.CUPO_MAXIMO < 1) {
      setError('El cupo máximo debe ser mayor a 0');
      return;
    }

    saveActividad();
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Actividades</h1>
      
      <button
        className="mb-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
        onClick={() => openModal()}
        disabled={loading}
      >
        Nueva Actividad
      </button>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && !showModal && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Cargando...
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Nombre</th>
              <th className="px-4 py-2 border-b text-left">Descripción</th>
              <th className="px-4 py-2 border-b text-left">Fecha y Hora</th>
              <th className="px-4 py-2 border-b text-left">Cupo Máximo</th>
              <th className="px-4 py-2 border-b text-left">Ubicación</th>
              <th className="px-4 py-2 border-b text-left">Tipo</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No hay actividades registradas
                </td>
              </tr>
            ) : (
              actividades.map((a, index) => (
                <tr key={a.ID_ACTIVIDAD || `actividad-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{a.ID_ACTIVIDAD}</td>
                  <td className="px-4 py-2 border-b font-medium">{a.NOMBRE_ACTIVIDAD}</td>
                  <td className="px-4 py-2 border-b">{a.DESCRIPCION || '-'}</td>
                  <td className="px-4 py-2 border-b">
                    {a.FECHA_HORA ? new Date(a.FECHA_HORA).toLocaleString('es-ES') : '-'}
                  </td>
                  <td className="px-4 py-2 border-b text-center">{a.CUPO_MAXIMO}</td>
                  <td className="px-4 py-2 border-b">{a.UBICACION}</td>
                  <td className="px-4 py-2 border-b">{a.TIPO_ACTIVIDAD}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => openModal(a)}
                      className="text-blue-600 hover:text-blue-800 mr-3 disabled:opacity-50"
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteActividad(a.ID_ACTIVIDAD)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
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
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Actividad' : 'Nueva Actividad'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  name="NOMBRE_ACTIVIDAD"
                  value={form.NOMBRE_ACTIVIDAD}
                  onChange={handleChange}
                  placeholder="Nombre de la actividad"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="DESCRIPCION"
                  value={form.DESCRIPCION}
                  onChange={handleChange}
                  placeholder="Descripción de la actividad"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y Hora *
                </label>
                <input
                  name="FECHA_HORA"
                  type="datetime-local"
                  value={form.FECHA_HORA}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cupo Máximo *
                </label>
                <input
                  name="CUPO_MAXIMO"
                  type="number"
                  min="1"
                  value={form.CUPO_MAXIMO}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  name="UBICACION"
                  value={form.UBICACION}
                  onChange={handleChange}
                  placeholder="Ubicación de la actividad"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Actividad *
                </label>
                <input
                  name="TIPO_ACTIVIDAD"
                  value={form.TIPO_ACTIVIDAD}
                  onChange={handleChange}
                  placeholder="Ej: Deportiva, Cultural, Educativa"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Administrador
                </label>
                <input
                  name="ID_ADMINISTRADOR"
                  type="number"
                  min="1"
                  value={form.ID_ADMINISTRADOR ?? ''}
                  onChange={handleChange}
                  placeholder="ID del administrador responsable"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}