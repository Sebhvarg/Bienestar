import React, { useEffect, useState } from 'react';

interface Medico {
  ID_MEDICO: number;
  NOMBRE: string;
  APELLIDO: string;
  ESPECIALIDAD: string;
  ID_USUARIO: number;
}

export default function GestionMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Medico>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios?rol=Medico');
      const data = await res.json();
      setMedicos(data.data || []);
      setError(null);
    } catch {
      setError('Error al cargar médicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicos(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/usuarios', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, operacion: editingId ? 'U' : 'C', idUsuario: editingId }),
      });
      setForm({});
      setEditingId(null);
      fetchMedicos();
    } catch {
      setError('Error al guardar');
    }
  };

  const handleEdit = (medico: Medico) => {
    setForm(medico);
    setEditingId(medico.ID_USUARIO);
  };

  const handleDelete = async (idUsuario: number) => {
    if (!window.confirm('¿Eliminar médico?')) return;
    await fetch('/api/admin/usuarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operacion: 'D', idUsuario }),
    });
    fetchMedicos();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Médicos</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
        <input name="NOMBRE" value={form.NOMBRE || ''} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" required />
        <input name="APELLIDO" value={form.APELLIDO || ''} onChange={handleChange} placeholder="Apellido" className="border p-2 rounded" required />
        <input name="ESPECIALIDAD" value={form.ESPECIALIDAD || ''} onChange={handleChange} placeholder="Especialidad" className="border p-2 rounded" required />
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">{editingId ? 'Actualizar' : 'Agregar'}</button>
        {editingId && <button type="button" onClick={()=>{setForm({});setEditingId(null);}} className="ml-2 text-gray-600">Cancelar</button>}
      </form>
      {loading ? <p>Cargando...</p> : error ? <p className="text-red-600">{error}</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Apellido</th>
              <th className="px-4 py-2 border-b">Especialidad</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map(m => (
              <tr key={m.ID_MEDICO} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{m.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{m.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{m.ESPECIALIDAD}</td>
                <td className="px-4 py-2 border-b">
                  <button onClick={()=>handleEdit(m)} className="text-blue-600 mr-2">Editar</button>
                  <button onClick={()=>handleDelete(m.ID_USUARIO)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
