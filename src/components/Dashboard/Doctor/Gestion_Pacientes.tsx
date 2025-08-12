import React, { useEffect, useState } from 'react';

interface Paciente {
  ID_ESTUDIANTE: number;
  NOMBRE: string;
  APELLIDO: string;
  CARRERA: string;
  CORREO_ELECTRONICO: string;
  ESTADO: boolean;
}

export default function GestionPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor/pacientes');
      const data = await res.json();
      setPacientes(data.data || []);
      setError(null);
    } catch {
      setError('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPacientes(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>
      {loading ? <p>Cargando...</p> : error ? <p className="text-red-600">{error}</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Apellido</th>
              <th className="px-4 py-2 border-b">Carrera</th>
              <th className="px-4 py-2 border-b">Correo</th>
              <th className="px-4 py-2 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(p => (
              <tr key={p.ID_ESTUDIANTE} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{p.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{p.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{p.CARRERA}</td>
                <td className="px-4 py-2 border-b">{p.CORREO_ELECTRONICO}</td>
                <td className="px-4 py-2 border-b">{p.ESTADO ? 'Activo' : 'Inactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
