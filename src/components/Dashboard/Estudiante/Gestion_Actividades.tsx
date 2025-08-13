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
  const [actividadesInscritas, setActividadesInscritas] = useState<number[]>([]);

  const idEstudiante = 1; // Cambiar por el ID del estudiante autenticado

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
      const actividades = Array.isArray(data.data) && Array.isArray(data.data[0]) ? data.data[0] : [];
      setActividades(actividades);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener actividades ya inscritas
  const fetchInscripciones = async () => {
    try {
      const res = await fetch(`/api/estudiante/inscripciones/${idEstudiante}`);
      if (!res.ok) throw new Error('Error al obtener inscripciones');
      const data = await res.json();
      setActividadesInscritas(data.data?.map((a: any) => a.ID_ACTIVIDAD) || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Inscribir estudiante en una actividad
  const inscribirEstudiante = async (actividadId?: number) => {
    if (!actividadId) return;
    try {
      const res = await fetch('/api/estudiante/inscripcion-actividad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idEstudiante, idActividad: actividadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al inscribirse');

      alert(data.data?.Mensaje || 'Inscripción exitosa');

      // Agregar actividad a las inscritas para bloquear el botón
      setActividadesInscritas(prev => [...prev, actividadId]);
    } catch (e: any) {
      alert(e.message || 'Error al inscribirse');
    }
  };

  useEffect(() => {
    fetchActividades();
    fetchInscripciones();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Actividades Disponibles</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
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
              <th className="px-4 py-2 border-b text-left">Inscribirse</th>
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
              actividades.map((a, index) => {
                const yaInscrito = actividadesInscritas.includes(a.ID_ACTIVIDAD!);
                return (
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
                        onClick={() => inscribirEstudiante(a.ID_ACTIVIDAD)}
                        className={`px-3 py-1 text-white rounded ${yaInscrito ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
                        disabled={yaInscrito}
                      >
                        {yaInscrito ? 'Inscrito' : 'Inscribirse'}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
