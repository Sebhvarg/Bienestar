import React, { useEffect, useState } from 'react';

interface Estudiante {
  ID_ESTUDIANTE: number;
  NUMERO_MATRICULA: string;
  NOMBRE: string;
  APELLIDO: string;
}

interface DetalleParticipacion {
  NOMBRE_ACTIVIDAD: string;
  TIPO_ACTIVIDAD: string;
  Estado_Participacion: 'Participó' | 'No Participó';
}

export default function ReporteParticipacion() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<DetalleParticipacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener estudiantes para el ComboBox
  const fetchEstudiantes = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuario?rol=Estudiante');
      if (!res.ok) throw new Error('Error al cargar estudiantes');
      const data = await res.json();
      const lista: Estudiante[] = (data.data || []).map((e: any) => ({
        ID_ESTUDIANTE: e.ID_ESTUDIANTE, // <-- aquí el ID real del estudiante
        NUMERO_MATRICULA: e.NUMERO_MATRICULA,
        NOMBRE: e.NOMBRE,
        APELLIDO: e.APELLIDO,
      }));
      setEstudiantes(lista);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  // Obtener reporte para el estudiante seleccionado
  const fetchReporte = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/reporte-participacion/${id}`);
      if (!res.ok) throw new Error('Error al cargar el reporte');
      const data = await res.json();
      setDetalle(data.detalle || []);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setDetalle([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  useEffect(() => {
    if (selectedId !== null) fetchReporte(selectedId);
  }, [selectedId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reporte de Participación</h1>

      {/* Selector de estudiante */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Selecciona un estudiante:</label>
        <select
          className="border p-2 rounded"
          value={selectedId ?? ''}
          onChange={(e) => setSelectedId(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">-- Seleccionar --</option>
          {estudiantes.map((est) => (
            <option key={est.ID_ESTUDIANTE} value={est.ID_ESTUDIANTE}>
              {est.NOMBRE} {est.APELLIDO} ({est.NUMERO_MATRICULA})
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Detalle de participación */}
      {detalle.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Detalle de Actividades</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border-b">Actividad</th>
                <th className="px-4 py-2 border-b">Tipo</th>
                <th className="px-4 py-2 border-b">Estado</th>
              </tr>
            </thead>
            <tbody>
              {detalle.map((d, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{d.NOMBRE_ACTIVIDAD}</td>
                  <td className="px-4 py-2 border-b">{d.TIPO_ACTIVIDAD}</td>
                  <td
                    className={`px-4 py-2 border-b ${
                      d.Estado_Participacion === 'Participó' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {d.Estado_Participacion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && detalle.length === 0 && selectedId !== null && (
        <p>No hay datos disponibles para este estudiante.</p>
      )}
    </div>
  );
}
