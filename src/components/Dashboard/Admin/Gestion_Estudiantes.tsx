import React, { useEffect, useState } from 'react';

interface Usuario {
  ID_USUARIO?: number;
  NUMERO_MATRICULA?: string;
  NOMBRE: string;
  APELLIDO: string;
  CARRERA?: string;
  FECHA_NACIMIENTO?: string;
  NOMBRE_USUARIO: string;
  CONTRA?: string;
  CORREO_ELECTRONICO: string;
  TELEFONO?: string;
  PROMEDIO_ACADEMICO?: number;
  ESTADO: boolean;
  ROL: 'Estudiante' | 'Administrador' | 'Medico';
}

export default function GestionEstudiantes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Usuario, 'ID_USUARIO'>>({
    NUMERO_MATRICULA: '',
    NOMBRE: '',
    APELLIDO: '',
    CARRERA: '',
    FECHA_NACIMIENTO: '',
    CORREO_ELECTRONICO: '',
    TELEFONO: '',
    PROMEDIO_ACADEMICO: undefined,
    ESTADO: true,
    ROL: 'Estudiante',
    NOMBRE_USUARIO: '',
    CONTRA: '',
  });

  const normalizeFormValue = (name: string, value: string | boolean) => {
    if (name === 'ESTADO' && typeof value === 'boolean') return value;
    if (name === 'PROMEDIO_ACADEMICO') return value === '' ? undefined : Number(value);
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(prev => ({ ...prev, [name]: normalizeFormValue(name, value) }));
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/usuario?rol=Estudiante');
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      const estudiantesFiltrados = Array.isArray(data.data)
        ? data.data.filter((u: Usuario) => u.ROL === 'Estudiante')
        : [];
      setUsuarios(estudiantesFiltrados);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (usuario?: Usuario) => {
    if (usuario) {
      setEditingId(usuario.ID_USUARIO ?? null);
      setForm({
        NUMERO_MATRICULA: usuario.NUMERO_MATRICULA || '',
        NOMBRE: usuario.NOMBRE,
        APELLIDO: usuario.APELLIDO,
        CARRERA: usuario.CARRERA || '',
        FECHA_NACIMIENTO: usuario.FECHA_NACIMIENTO
          ? new Date(usuario.FECHA_NACIMIENTO).toISOString().split('T')[0]
          : '',
        CORREO_ELECTRONICO: usuario.CORREO_ELECTRONICO,
        TELEFONO: usuario.TELEFONO || '',
        PROMEDIO_ACADEMICO: usuario.PROMEDIO_ACADEMICO,
        ESTADO: usuario.ESTADO,
        ROL: 'Estudiante',
        NOMBRE_USUARIO: usuario.NOMBRE_USUARIO,
        CONTRA: '',
      });
    } else {
      setEditingId(null);
      setForm({
        NUMERO_MATRICULA: '',
        NOMBRE: '',
        APELLIDO: '',
        CARRERA: '',
        FECHA_NACIMIENTO: '',
        CORREO_ELECTRONICO: '',
        TELEFONO: '',
        PROMEDIO_ACADEMICO: undefined,
        ESTADO: true,
        ROL: 'Estudiante',
        NOMBRE_USUARIO: '',
        CONTRA: '',
      });
    }
    setShowModal(true);
    setError(null);
  };

  const saveUsuario = async () => {
    const url = editingId
  ? `http://localhost:4000/api/admin/usuario/${editingId}`
  : `http://localhost:4000/api/admin/usuario`;

    const method = editingId ? 'PUT' : 'POST';
    const payload: any = {
      idUsuario: editingId || undefined,
      nombreUsuario: form.NOMBRE_USUARIO,
      contra: form.CONTRA || undefined,
      rol: 'Estudiante',
      nombre: form.NOMBRE,
      apellido: form.APELLIDO,
      matricula: form.NUMERO_MATRICULA || null,
      carrera: form.CARRERA || null,
      fechaNacimiento: form.FECHA_NACIMIENTO || null,
      correo: form.CORREO_ELECTRONICO,
      telefono: form.TELEFONO || null,
      especialidad: null,
      promedioAcademico: form.PROMEDIO_ACADEMICO ?? null,
      estado: form.ESTADO,
    };
    if (editingId && !form.CONTRA) delete payload.contra;

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al guardar usuario');
      await fetchUsuarios();
      setShowModal(false);
      setEditingId(null);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este estudiante?')) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/admin/usuario/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar usuario');
      await fetchUsuarios();
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUsuario();
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estudiantes</h1>
      <button
        className="mb-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        onClick={() => openModal()}
      >
        Nuevo Estudiante
      </button>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b text-left">Matrícula</th>
              <th className="px-4 py-2 border-b text-left">Nombre</th>
              <th className="px-4 py-2 border-b text-left">Apellido</th>
              <th className="px-4 py-2 border-b text-left">Carrera</th>
              <th className="px-4 py-2 border-b text-left">Correo</th>
              <th className="px-4 py-2 border-b text-left">Promedio</th>
              <th className="px-4 py-2 border-b text-left">Estado</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.ID_USUARIO} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{u.NUMERO_MATRICULA}</td>
                <td className="px-4 py-2 border-b">{u.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{u.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{u.CARRERA}</td>
                <td className="px-4 py-2 border-b">{u.CORREO_ELECTRONICO}</td>
                <td className="px-4 py-2 border-b">{u.PROMEDIO_ACADEMICO ?? '-'}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.ESTADO ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.ESTADO ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <button onClick={() => openModal(u)} className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button onClick={() => deleteUsuario(u.ID_USUARIO)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-90vh overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="NOMBRE_USUARIO" value={form.NOMBRE_USUARIO} onChange={handleChange} placeholder="Nombre de usuario" required className="w-full px-3 py-2 border rounded"/>
              {!editingId && <input name="CONTRA" type="password" value={form.CONTRA} onChange={handleChange} placeholder="Contraseña" required className="w-full px-3 py-2 border rounded"/>}
              <input name="NUMERO_MATRICULA" value={form.NUMERO_MATRICULA} onChange={handleChange} placeholder="Número de Matrícula" required className="w-full px-3 py-2 border rounded"/>
              <input name="NOMBRE" value={form.NOMBRE} onChange={handleChange} placeholder="Nombre" required className="w-full px-3 py-2 border rounded"/>
              <input name="APELLIDO" value={form.APELLIDO} onChange={handleChange} placeholder="Apellido" required className="w-full px-3 py-2 border rounded"/>
              <input name="CARRERA" value={form.CARRERA} onChange={handleChange} placeholder="Carrera" required className="w-full px-3 py-2 border rounded"/>
              <input name="FECHA_NACIMIENTO" type="date" value={form.FECHA_NACIMIENTO || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded"/>
              <input name="CORREO_ELECTRONICO" type="email" value={form.CORREO_ELECTRONICO} onChange={handleChange} placeholder="Correo Electrónico" required className="w-full px-3 py-2 border rounded"/>
              <input name="TELEFONO" type="tel" value={form.TELEFONO || ''} onChange={handleChange} placeholder="Teléfono" className="w-full px-3 py-2 border rounded"/>
              <input name="PROMEDIO_ACADEMICO" type="number" step="0.01" min="0" max="10" value={form.PROMEDIO_ACADEMICO ?? ''} onChange={handleChange} placeholder="Promedio Académico" className="w-full px-3 py-2 border rounded"/>
              <label className="inline-flex items-center space-x-2">
                <input name="ESTADO" type="checkbox" checked={form.ESTADO} onChange={handleChange} className="form-checkbox text-teal-600"/>
                <span>Activo</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setError(null); }} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">{editingId ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
