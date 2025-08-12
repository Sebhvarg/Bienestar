import React, { useEffect, useState } from 'react';

interface Usuario {
  ID_USUARIO: number;
  NOMBRE: string;
  APELLIDO: string;
  ROL: string;
}

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Usuario>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios');
      const data = await res.json();
      setUsuarios(data.data || []);
      setError(null);
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

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
      fetchUsuarios();
    } catch {
      setError('Error al guardar');
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setForm(usuario);
    setEditingId(usuario.ID_USUARIO);
  };

  const handleDelete = async (idUsuario: number) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    await fetch('/api/admin/usuarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operacion: 'D', idUsuario }),
    });
    fetchUsuarios();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
        <input name="NOMBRE" value={form.NOMBRE || ''} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" required />
        <input name="APELLIDO" value={form.APELLIDO || ''} onChange={handleChange} placeholder="Apellido" className="border p-2 rounded" required />
        <input name="ROL" value={form.ROL || ''} onChange={handleChange} placeholder="Rol" className="border p-2 rounded" required />
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">{editingId ? 'Actualizar' : 'Agregar'}</button>
        {editingId && <button type="button" onClick={()=>{setForm({});setEditingId(null);}} className="ml-2 text-gray-600">Cancelar</button>}
      </form>
      {loading ? <p>Cargando...</p> : error ? <p className="text-red-600">{error}</p> : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Apellido</th>
              <th className="px-4 py-2 border-b">Rol</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.ID_USUARIO} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{u.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{u.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{u.ROL}</td>
                <td className="px-4 py-2 border-b">
                  <button onClick={()=>handleEdit(u)} className="text-blue-600 mr-2">Editar</button>
                  <button onClick={()=>handleDelete(u.ID_USUARIO)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
