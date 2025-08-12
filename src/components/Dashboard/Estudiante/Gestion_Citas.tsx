import React, { useEffect, useState } from 'react';

interface Cita {
  ID_CITA: number;
  FECHA: string;
  HORA: string;
  ESTADO: string;
  NOMBRE_MEDICO: string;
  APELLIDO_MEDICO: string;
}

export default function GestionCitasEstudiante() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/estudiante/citas');
      const data = await res.json();
      setCitas(data.data || []);
      setError(null);
    } catch {
      setError('Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCitas(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
      {loading ? <p>Cargando...</p> : error ? <p className="text-red-600">{error}</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Hora</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Médico</th>
            </tr>
          </thead>
          <tbody>
            {citas.map(c => (
              <tr key={c.ID_CITA} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{c.FECHA}</td>
                <td className="px-4 py-2 border-b">{c.HORA}</td>
                <td className="px-4 py-2 border-b">{c.ESTADO}</td>
                <td className="px-4 py-2 border-b">{c.NOMBRE_MEDICO} {c.APELLIDO_MEDICO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
