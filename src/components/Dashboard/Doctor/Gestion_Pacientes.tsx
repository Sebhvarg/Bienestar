import React, { useEffect, useState } from 'react';

interface Historial {
  ID_HISTORIAL: number;
  NOMBRE: string;
  APELLIDO: string;
  CARRERA: string;
  FECHA: string;
  DIAGNOSTICO: string;
  TRATAMIENTO: string;
}

export default function HistorialMedico() {
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor/historial-medico');
      const data = await res.json();
      setHistorial(data.data || []);
      setError(null);
    } catch {
      setError('Error al cargar historial médico');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistorial(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial Médico</h1>
      {loading ? <p>Cargando...</p> : error ? <p className="text-red-600">{error}</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Apellido</th>
              <th className="px-4 py-2 border-b">Carrera</th>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Diagnóstico</th>
              <th className="px-4 py-2 border-b">Tratamiento</th>
            </tr>
          </thead>
          <tbody>
            {historial.map(h => (
              <tr key={h.ID_HISTORIAL} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{h.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{h.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{h.CARRERA}</td>
                <td className="px-4 py-2 border-b">{new Date(h.FECHA).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">{h.DIAGNOSTICO}</td>
                <td className="px-4 py-2 border-b">{h.TRATAMIENTO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
