import React, { useEffect, useState } from 'react';

interface Usuario {
  ID_USUARIO?: number;
  NUMERO_MATRICULA?: string;  // Sólo estudiantes
  NOMBRE: string;
  APELLIDO: string;
  CARRERA?: string;            // Sólo estudiantes
  FECHA_NACIMIENTO?: string;   // Sólo estudiantes
  NOMBRE_USUARIO: string;      // Nombre de usuario
  CONTRA?: string;             // Contraseña del usuario
  CORREO_ELECTRONICO: string;
  TELEFONO?: string;
  PROMEDIO_ACADEMICO?: number; // Sólo estudiantes
  ESTADO: boolean;
  ROL: 'Estudiante' | 'Administrador' | 'Medico';
}

export default function GestionEstudiantes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Usuario, 'ID_USUARIO'>>({
    NUMERO_MATRICULA: '',
    NOMBRE: '',
    APELLIDO: '',
    CARRERA: '',
    FECHA_NACIMIENTO: '',
    CORREO_ELECTRONICO: '',
    TELEFONO: '',
    CONTRA: '',
    NOMBRE_USUARIO: '',
    ESTADO: true,
    ROL: 'Estudiante',
    PROMEDIO_ACADEMICO: undefined,
  });
  const [showModal, setShowModal] = useState(false);

  // Obtener todos los usuarios y filtrar estudiantes
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios?rol=Estudiante');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'PROMEDIO_ACADEMICO'
          ? value === ''
            ? undefined
            : parseFloat(value)
          : value,
    }));
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
        ROL: 'Estudiante', // fijo porque este componente es solo para estudiantes
        NOMBRE_USUARIO: usuario.NOMBRE_USUARIO || '',
        CONTRA: '', // No rellenar contraseña para seguridad
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

  // Crear o actualizar usuario (estudiante)
  const saveUsuario = async () => {
    const url = '/api/admin/usuarios'; // Usar la misma URL para POST y PUT
    const method = editingId ? 'PUT' : 'POST';

    // Payload completo con todos los campos necesarios
    const payload = {
      idUsuario: editingId || undefined, // Solo enviar si estamos editando
      nombreUsuario: form.NOMBRE_USUARIO,
      contra: form.CONTRA || undefined, // Solo para creación
      rol: 'Estudiante',
      nombre: form.NOMBRE,
      apellido: form.APELLIDO,
      matricula: form.NUMERO_MATRICULA || null,
      carrera: form.CARRERA || null,
      fechaNacimiento: form.FECHA_NACIMIENTO || null,
      correo: form.CORREO_ELECTRONICO,
      telefono: form.TELEFONO || null,
      especialidad: null, // Siempre null para estudiantes
      estado: form.ESTADO,
      promedioAcademico: form.PROMEDIO_ACADEMICO ?? null,
    };

    // Para actualización, la contraseña es opcional
    if (editingId && !form.CONTRA) {
      delete payload.contra;
    }

    console.log('Payload enviado:', payload); // Para debugging

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Respuesta exitosa:', result); // Para debugging
      
      await fetchUsuarios();
      setShowModal(false);
      setEditingId(null);
      setError(null);
    } catch (e) {
      console.error('Error en saveUsuario:', e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const deleteUsuario = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este estudiante?')) return;
    try {
      setLoading(true);
      // Cambiar la URL para incluir el ID como parámetro
      const res = await fetch(`/api/admin/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        // Remover el body ya que no es necesario
      });
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

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      )}

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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.ESTADO ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {u.ESTADO ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => openModal(u)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteUsuario(u.ID_USUARIO)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
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
              <input
                name="NOMBRE_USUARIO"
                value={form.NOMBRE_USUARIO}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                required
                className="w-full px-3 py-2 border rounded"
              />
              {!editingId && (
                <input
                  name="CONTRA"
                  value={form.CONTRA}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  type="password"
                  required={!editingId}
                  className="w-full px-3 py-2 border rounded"
                />
              )}
              <input
                name="NUMERO_MATRICULA"
                value={form.NUMERO_MATRICULA}
                onChange={handleChange}
                placeholder="Número de Matrícula"
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                name="NOMBRE"
                value={form.NOMBRE}
                onChange={handleChange}
                placeholder="Nombre"
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                name="APELLIDO"
                value={form.APELLIDO}
                onChange={handleChange}
                placeholder="Apellido"
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                name="CARRERA"
                value={form.CARRERA}
                onChange={handleChange}
                placeholder="Carrera"
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                name="FECHA_NACIMIENTO"
                type="date"
                value={form.FECHA_NACIMIENTO || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                name="CORREO_ELECTRONICO"
                type="email"
                value={form.CORREO_ELECTRONICO}
                onChange={handleChange}
                placeholder="Correo Electrónico"
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                name="TELEFONO"
                type="tel"
                value={form.TELEFONO || ''}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                name="PROMEDIO_ACADEMICO"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={form.PROMEDIO_ACADEMICO ?? ''}
                onChange={handleChange}
                placeholder="Promedio Académico"
                className="w-full px-3 py-2 border rounded"
              />

              <label className="inline-flex items-center space-x-2">
                <input
                  name="ESTADO"
                  type="checkbox"
                  checked={form.ESTADO}
                  onChange={handleChange}
                  className="form-checkbox text-teal-600"
                />
                <span>Activo</span>
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setError(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}