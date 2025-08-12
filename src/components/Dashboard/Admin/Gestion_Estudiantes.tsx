import React, { useEffect, useState } from 'react';

interface Estudiante {
  ID_ESTUDIANTE?: number;
  NUMERO_MATRICULA: string;
  NOMBRE: string;
  APELLIDO: string;
  CARRERA: string;
  FECHA_NACIMIENTO?: string;
  CORREO_ELECTRONICO: string;
  TELEFONO?: string;
  PROMEDIO_ACADEMICO?: number;
  ESTADO: boolean;
}

interface FormularioEstudiante {
  NUMERO_MATRICULA: string;
  NOMBRE: string;
  APELLIDO: string;
  CARRERA: string;
  FECHA_NACIMIENTO: string;
  CORREO_ELECTRONICO: string;
  TELEFONO: string;
  PROMEDIO_ACADEMICO: string;
  ESTADO: boolean;
}

export default function GestionEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null);
  const [formData, setFormData] = useState<FormularioEstudiante>({
    NUMERO_MATRICULA: '',
    NOMBRE: '',
    APELLIDO: '',
    CARRERA: '',
    FECHA_NACIMIENTO: '',
    CORREO_ELECTRONICO: '',
    TELEFONO: '',
    PROMEDIO_ACADEMICO: '',
    ESTADO: true
  });

  // Cargar estudiantes
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/estudiantes');
      if (!res.ok) throw new Error('Error al cargar estudiantes');
      const data = await res.json();
      // El backend retorna los datos en data[0] (por ser resultado de CALL)
      const estudiantesArray = Array.isArray(data) ? data : (Array.isArray(data[0]) ? data[0] : []);
      setEstudiantes(estudiantesArray);
      setError(null);
    } catch (e) {
      setError('Error al cargar estudiantes: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Crear estudiante
  const createEstudiante = async () => {
    try {
      const payload = {
        numero_matricula: formData.NUMERO_MATRICULA,
        nombre: formData.NOMBRE,
        apellido: formData.APELLIDO,
        carrera: formData.CARRERA,
        fecha_nacimiento: formData.FECHA_NACIMIENTO ? formData.FECHA_NACIMIENTO.split('T')[0] : null,
        correo_electronico: formData.CORREO_ELECTRONICO,
        telefono: formData.TELEFONO || null,
        promedio_academico: formData.PROMEDIO_ACADEMICO ? parseFloat(formData.PROMEDIO_ACADEMICO) : null,
        estado: formData.ESTADO
      };

      console.log('Creando estudiante:', payload);

      const res = await fetch('/api/admin/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json();
      console.log('Respuesta del servidor:', responseData);

      if (!res.ok) {
        throw new Error(responseData.error || 'Error al crear estudiante');
      }
      
      await fetchEstudiantes();
      resetForm();
      setShowModal(false);
      setError(null);
    } catch (e) {
      console.error('Error en createEstudiante:', e);
      setError('Error al crear estudiante: ' + (e as Error).message);
    }
  };

  // Actualizar estudiante
  const updateEstudiante = async () => {
    if (!editingStudent?.ID_ESTUDIANTE) return;

    try {
      const payload = {
        numero_matricula: formData.NUMERO_MATRICULA,
        nombre: formData.NOMBRE,
        apellido: formData.APELLIDO,
        carrera: formData.CARRERA,
        fecha_nacimiento: formData.FECHA_NACIMIENTO ? formData.FECHA_NACIMIENTO.split('T')[0] : null,
        correo_electronico: formData.CORREO_ELECTRONICO,
        telefono: formData.TELEFONO || null,
        promedio_academico: formData.PROMEDIO_ACADEMICO ? parseFloat(formData.PROMEDIO_ACADEMICO) : null,
        estado: formData.ESTADO
      };

      console.log('Actualizando estudiante:', editingStudent.ID_ESTUDIANTE, payload);

      const res = await fetch(`/api/admin/estudiantes/${editingStudent.ID_ESTUDIANTE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json();
      console.log('Respuesta del servidor:', responseData);

      if (!res.ok) {
        throw new Error(responseData.error || 'Error al actualizar estudiante');
      }
      
      await fetchEstudiantes();
      resetForm();
      setShowModal(false);
      setError(null);
    } catch (e) {
      console.error('Error en updateEstudiante:', e);
      setError('Error al actualizar estudiante: ' + (e as Error).message);
    }
  };

  // Eliminar estudiante
  const deleteEstudiante = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) return;

    try {
      const res = await fetch(`/api/admin/estudiantes/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar estudiante');
      
      await fetchEstudiantes();
    } catch (e) {
      setError('Error al eliminar estudiante: ' + (e as Error).message);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      NUMERO_MATRICULA: '',
      NOMBRE: '',
      APELLIDO: '',
      CARRERA: '',
      FECHA_NACIMIENTO: '',
      CORREO_ELECTRONICO: '',
      TELEFONO: '',
      PROMEDIO_ACADEMICO: '',
      ESTADO: true
    });
    setEditingStudent(null);
  };

  // Abrir modal para crear
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Abrir modal para editar
  const openEditModal = (estudiante: Estudiante) => {
    setEditingStudent(estudiante);
    // Convertir la fecha a formato YYYY-MM-DD si existe
    const fechaNacimiento = estudiante.FECHA_NACIMIENTO 
      ? new Date(estudiante.FECHA_NACIMIENTO).toISOString().split('T')[0]
      : '';
    
    setFormData({
      NUMERO_MATRICULA: estudiante.NUMERO_MATRICULA,
      NOMBRE: estudiante.NOMBRE,
      APELLIDO: estudiante.APELLIDO,
      CARRERA: estudiante.CARRERA,
      FECHA_NACIMIENTO: fechaNacimiento,
      CORREO_ELECTRONICO: estudiante.CORREO_ELECTRONICO,
      TELEFONO: estudiante.TELEFONO || '',
      PROMEDIO_ACADEMICO: estudiante.PROMEDIO_ACADEMICO?.toString() || '',
      ESTADO: estudiante.ESTADO
    });
    setShowModal(true);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      await updateEstudiante();
    } else {
      await createEstudiante();
    }
  };

  useEffect(() => { fetchEstudiantes(); }, []);

  // Render principal
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estudiantes</h1>
      
      {/* Botón para crear nuevo estudiante - CORREGIDO */}
      <button
        className="mb-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        onClick={openCreateModal}
      >
        Nuevo Estudiante
      </button>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
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
            {estudiantes.map(e => (
              <tr key={e.ID_ESTUDIANTE} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{e.NUMERO_MATRICULA}</td>
                <td className="px-4 py-2 border-b">{e.NOMBRE}</td>
                <td className="px-4 py-2 border-b">{e.APELLIDO}</td>
                <td className="px-4 py-2 border-b">{e.CARRERA}</td>
                <td className="px-4 py-2 border-b">{e.CORREO_ELECTRONICO}</td>
                <td className="px-4 py-2 border-b">{e.PROMEDIO_ACADEMICO ?? '-'}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    e.ESTADO ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {e.ESTADO ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  {/* Botón editar - CORREGIDO */}
                  <button 
                    onClick={() => openEditModal(e)} 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => e.ID_ESTUDIANTE && deleteEstudiante(e.ID_ESTUDIANTE)} 
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

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-90vh overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Matrícula *
                </label>
                <input
                  type="text"
                  name="NUMERO_MATRICULA"
                  value={formData.NUMERO_MATRICULA}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="NOMBRE"
                  value={formData.NOMBRE}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="APELLIDO"
                  value={formData.APELLIDO}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrera *
                </label>
                <input
                  type="text"
                  name="CARRERA"
                  value={formData.CARRERA}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="FECHA_NACIMIENTO"
                  value={formData.FECHA_NACIMIENTO}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="CORREO_ELECTRONICO"
                  value={formData.CORREO_ELECTRONICO}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="TELEFONO"
                  value={formData.TELEFONO}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promedio Académico
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="PROMEDIO_ACADEMICO"
                  value={formData.PROMEDIO_ACADEMICO}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="ESTADO"
                    checked={formData.ESTADO}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Activo</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  {editingStudent ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}