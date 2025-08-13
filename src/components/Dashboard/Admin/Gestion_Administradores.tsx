import React, { useEffect, useState } from 'react';

interface Admin {
  ID_ADMINISTRADOR: number;
  NOMBRE: string;
  APELLIDO: string;
  ID_USUARIO: number;
  NOMBRE_USUARIO: string;
  fechaNacimiento?: string;
}

export default function GestionAdministradores() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Admin> & { contra?: string; fechaNacimiento?: string }>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuarios?rol=Administrador');
      const data = await res.json();
      setAdmins((data.data || []).map((a: any) => ({
        ...a,
        NOMBRE_USUARIO: a.NOMBRE_USUARIO || a.NOMBRE_USUARIO || a.NOMBRE_USUARIO_ADMIN || '',
        fechaNacimiento: a.fechaNacimiento || '',
      })));
      setError(null);
    } catch {
      setError('Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId === null && editingId !== 0) {
      // Crear usuario
    } else if (editingId === null) {
      setError('ID de usuario inválido para actualizar');
      return;
    }

    const payload = {
      operacion: editingId ? 'U' : 'C',
      idUsuario: editingId,
      nombreUsuario: form.NOMBRE_USUARIO || '',
      contra: form.contra || '',
      rol: 'Administrador',
      nombre: form.NOMBRE || '',
      apellido: form.APELLIDO || '',
      matricula: '',
      carrera: '',
      fechaNacimiento: form.fechaNacimiento && form.fechaNacimiento.trim() !== '' ? form.fechaNacimiento : null,
      correo: '',
      telefono: '',
      especialidad: ''
    };

    try {
      const res = await fetch('http://localhost:4000/api/admin/usuarios', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }
      setForm({});
      setEditingId(null);
      setError(null);
      fetchAdmins();
    } catch (error) {
      setError('Error al guardar');
      console.error(error);
    }
  };

  const handleEdit = (admin: Admin) => {
    setForm({
      NOMBRE: admin.NOMBRE,
      APELLIDO: admin.APELLIDO,
      NOMBRE_USUARIO: admin.NOMBRE_USUARIO,
      fechaNacimiento: admin.fechaNacimiento || '',
      contra: '', // No mostramos la contraseña actual
    });
    setEditingId(admin.ID_USUARIO);
  };

  const handleDelete = async (idUsuario: number) => {
    if (!window.confirm('¿Eliminar administrador?')) return;
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuarios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operacion: 'D', idUsuario }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }
      fetchAdmins();
    } catch (error) {
      setError('Error al eliminar');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administradores</h1>

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
          name="fechaNacimiento"
          type="date"
          value={form.fechaNacimiento || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="contra"
          value={form.contra || ''}
          onChange={handleChange}
          placeholder="Contraseña"
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
              <th className="px-4 py-2 border-b">Fecha Nac.</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.ID_ADMINISTRADOR} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{a.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{a.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{a.NOMBRE_USUARIO}</td>
                <td className="px-4 py-2 border-b">{a.fechaNacimiento || '-'}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-blue-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(a.ID_USUARIO)}
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
