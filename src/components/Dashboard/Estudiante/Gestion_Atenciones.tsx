import React, { useEffect, useState } from 'react';

interface Atencion {
  ID_ATENCION: number;
  FECHA: string;
  MOTIVO: string;
  DIAGNOSTICO: string;
  NOMBRE_MEDICO: string;
  APELLIDO_MEDICO: string;
}

export default function GestionAtencionesEstudiante() {
  const [atenciones, setAtenciones] = useState<Atencion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAtenciones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/estudiante/atenciones');
      const data = await res.json();
      setAtenciones(data.data || []);
      setError(null);
    } catch {
      setError('Error al cargar atenciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAtenciones(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Atenciones</h1>
      {loading ? <p>Cargando...</p> : error ? <p className="text-red-600">{error}</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Motivo</th>
              <th className="px-4 py-2 border-b">Diagnóstico</th>
              <th className="px-4 py-2 border-b">Médico</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.map(a => (
              <tr key={a.ID_ATENCION} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{a.FECHA}</td>
                <td className="px-4 py-2 border-b">{a.MOTIVO}</td>
                <td className="px-4 py-2 border-b">{a.DIAGNOSTICO}</td>
                <td className="px-4 py-2 border-b">{a.NOMBRE_MEDICO} {a.APELLIDO_MEDICO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
