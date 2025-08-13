import React, { useEffect, useState } from 'react';

interface Medico {
  ID_MEDICO: number;
  ID_USUARIO: number;
  NOMBRE: string;
  APELLIDO: string;
  NOMBRE_USUARIO: string;
  ESPECIALIDAD?: string;
  ESTADO: number;
}

export default function GestionMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Medico> & { CONTRA?: string }>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuario?rol=Medico'); // ← ruta correcta
      const data = await res.json();
      setMedicos((data.data || []).map((m: any) => ({
        ...m,
        NOMBRE_USUARIO: m.NOMBRE_USUARIO || '',
        ESPECIALIDAD: m.ESPECIALIDAD || '',
      })));
      setError(null);
    } catch {
      setError('Error al cargar médicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      idUsuario: editingId,
      nombreUsuario: form.NOMBRE_USUARIO || '',
      rol: 'Medico',
      nombre: form.NOMBRE || '',
      apellido: form.APELLIDO || '',
      matricula: '',
      carrera: '',
      fechaNacimiento: null,
      correo: '',
      telefono: '',
      especialidad: form.ESPECIALIDAD || '',
      estado: form.ESTADO || 1,
    };

    if (!editingId || form.CONTRA?.trim()) {
      payload.contra = form.CONTRA || '';
    }

    try {
      const res = await fetch(
        editingId
          ? `http://localhost:4000/api/admin/usuario/${editingId}`
          : 'http://localhost:4000/api/admin/usuario',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      setForm({});
      setEditingId(null);
      setError(null);
      fetchMedicos();
    } catch (error) {
      setError('Error al guardar');
      console.error(error);
    }
  };

  const handleEdit = (medico: Medico) => {
    setForm({
      NOMBRE: medico.NOMBRE || '',
      APELLIDO: medico.APELLIDO || '',
      NOMBRE_USUARIO: medico.NOMBRE_USUARIO || '',
      ESPECIALIDAD: medico.ESPECIALIDAD || '',
      CONTRA: '',
      ESTADO: medico.ESTADO || 1,
    });
    setEditingId(medico.ID_USUARIO);
  };

  const handleDelete = async (idUsuario: number) => {
    if (!window.confirm('¿Eliminar médico?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/usuario/${idUsuario}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }
      fetchMedicos();
    } catch (error) {
      setError('Error al eliminar');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Médicos</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
        <input
          name="NOMBRE"
          value={form.NOMBRE || ''}
          onChange={handleChange}
          placeholder="Nombre"
          className="border p-2 rounded"
          required
        />
        <input
          name="APELLIDO"
          value={form.APELLIDO || ''}
          onChange={handleChange}
          placeholder="Apellido"
          className="border p-2 rounded"
          required
        />
        <input
          name="NOMBRE_USUARIO"
          value={form.NOMBRE_USUARIO || ''}
          onChange={handleChange}
          placeholder="Nombre de usuario"
          className="border p-2 rounded"
          required
        />
        <input
          name="ESPECIALIDAD"
          value={form.ESPECIALIDAD || ''}
          onChange={handleChange}
          placeholder="Especialidad"
          className="border p-2 rounded"
        />
        <input
          name="CONTRA"
          value={form.CONTRA || ''}
          onChange={handleChange}
          placeholder={editingId ? 'Cambiar contraseña (opcional)' : 'Contraseña'}
          className="border p-2 rounded"
          type="password"
          required={!editingId}
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          {editingId ? 'Actualizar' : 'Agregar'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({});
              setEditingId(null);
              setError(null);
            }}
            className="ml-2 text-gray-600"
          >
            Cancelar
          </button>
        )}
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Apellido</th>
              <th className="px-4 py-2 border-b">Usuario</th>
              <th className="px-4 py-2 border-b">Especialidad</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((m) => (
              <tr key={m.ID_MEDICO} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{m.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{m.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{m.NOMBRE_USUARIO}</td>
                <td className="px-4 py-2 border-b">{m.ESPECIALIDAD || '-'}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(m)}
                    className="text-blue-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(m.ID_USUARIO)}
                    className="text-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
