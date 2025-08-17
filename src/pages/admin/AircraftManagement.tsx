import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Plane, Eye, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { aeronavesAPI } from '../../services/api';

const AircraftManagement: React.FC = () => {
  const { aircraft, addAircraft, updateAircraft, deleteAircraft, loadAircraftFromAPI } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<any>(null);
  const [viewingAircraft, setViewingAircraft] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    matricula: '',
    model: '',
    capacity: '',
    compania: '',
    tipoAeronave: 'Comercial',
    claseServicio: 'Económica'
  });

  // Cargar datos al montar el componente
  React.useEffect(() => {
    console.log('Loading aircraft data...');
    loadAircraftFromAPI();
  }, []);

  // Debug: Log aircraft data when it changes
  React.useEffect(() => {
    console.log('Aircraft data updated:', aircraft);
  }, [aircraft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create aircraft data with all fields
    const aircraftData = {
      matricula: formData.matricula || `HK${Date.now().toString().slice(-3)}`, // Generate if empty
      modelo: formData.model,
      capacidad: parseInt(formData.capacity) || 100, // Default to 100 if empty
      compania: formData.compania,
      tipoAeronave: formData.tipoAeronave,
      claseServicio: formData.claseServicio
    };

    // Validate required fields
    if (!aircraftData.matricula || !aircraftData.modelo || !aircraftData.compania) {
      alert('Por favor completa todos los campos requeridos: Matrícula, Modelo y Compañía');
      setLoading(false);
      return;
    }

    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form data before processing:', formData);
    console.log('Final aircraft data to send:', aircraftData);
    console.log('JSON stringified:', JSON.stringify(aircraftData, null, 2));

    try {
      if (editingAircraft) {
        console.log('Updating aircraft with ID:', editingAircraft.id);
        const updatedAircraft = await aeronavesAPI.update(editingAircraft.id, aircraftData);
        console.log('Update response:', updatedAircraft);

        // Reload data from API to ensure consistency
        await loadAircraftFromAPI();
      } else {
        console.log('Creating new aircraft');
        const newAircraft = await aeronavesAPI.create(aircraftData);
        console.log('Create response:', newAircraft);

        // Reload data from API to ensure consistency
        await loadAircraftFromAPI();
      }
      resetForm();
    } catch (error) {
      console.error('Error saving aircraft:', error);

      // More detailed error handling
      if (error instanceof Error) {
        alert(`Error al guardar la aeronave: ${error.message}`);
      } else {
        alert('Error al guardar la aeronave. Revisa la consola para más detalles.');
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      matricula: '',
      model: '',
      capacity: '',
      compania: '',
      tipoAeronave: 'Comercial',
      claseServicio: 'Económica'
    });
    setEditingAircraft(null);
    setIsModalOpen(false);
  };

  const handleViewDetails = (aircraft: any) => {
    setViewingAircraft(aircraft);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setViewingAircraft(null);
    setIsDetailsModalOpen(false);
  };

  const handleEdit = (aircraft: any) => {
    setEditingAircraft(aircraft);
    setFormData({
      matricula: aircraft.matricula || '',
      model: aircraft.model || '',
      capacity: aircraft.capacity?.toString() || '',
      compania: aircraft.compania || '',
      tipoAeronave: aircraft.tipoAeronave || 'Comercial',
      claseServicio: aircraft.claseServicio || 'Económica'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta aeronave?')) {
      setLoading(true);
      try {
        await aeronavesAPI.delete(id);
        deleteAircraft(id);
        // Reload data from API to ensure consistency
        await loadAircraftFromAPI();
        alert('Aeronave eliminada exitosamente.');
      } catch (error) {
        console.error('Error deleting aircraft:', error);

        // Handle specific foreign key constraint error
        if (error instanceof Error && error.message.includes('foreign key constraint fails')) {
          alert('❌ No se puede eliminar esta aeronave\n\n' +
            '🔗 Motivo: Esta aeronave está asignada a vuelos existentes\n\n' +
            '💡 Solución:\n' +
            '1. Elimina o reasigna los vuelos que usan esta aeronave\n' +
            '2. Luego podrás eliminar la aeronave\n\n' +
            'Esto protege la integridad de los datos del sistema.');
        } else {
          alert('Error al eliminar la aeronave. Intenta de nuevo.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'maintenance': return 'Mantenimiento';
      case 'inactive': return 'Inactiva';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Aeronaves</h1>
          <p className="text-gray-600">Administra la flota de aeronaves</p>
        </div>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Aeronave</span>
          </button>
        </div>
      </div>

      {/* Aircraft List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compañía
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aircraft.map((item, index) => (
                <tr key={item.id || `aircraft-${item.matricula}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Plane className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{item.matricula || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.capacity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.compania || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.tipoAeronave || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.claseServicio || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.relacionAeropuerto ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        En Uso
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Disponible
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-sky-600 hover:text-sky-900"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title={item.relacionAeropuerto ? "Esta aeronave está en uso y no se puede eliminar" : "Eliminar aeronave"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingAircraft ? 'Editar Aeronave' : 'Agregar Nueva Aeronave'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="HK123"
                    required
                    minLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo de Aeronave
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Boeing 737"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad de Pasajeros
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="180"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compañía
                  </label>
                  <input
                    type="text"
                    value={formData.compania}
                    onChange={(e) => setFormData({ ...formData, compania: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Avianca"
                    required
                    minLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Aeronave
                  </label>
                  <select
                    value={formData.tipoAeronave}
                    onChange={(e) => setFormData({ ...formData, tipoAeronave: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="Comercial">Comercial</option>
                    <option value="Carga">Carga</option>
                    <option value="Privado">Privado</option>
                    <option value="Militar">Militar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clase de Servicio
                  </label>
                  <select
                    value={formData.claseServicio}
                    onChange={(e) => setFormData({ ...formData, claseServicio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="Económica">Económica</option>
                    <option value="Business">Business</option>
                    <option value="Premium">Premium</option>
                    <option value="Primera Clase">Primera Clase</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
                >
                  {loading ? 'Guardando...' : (editingAircraft ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && viewingAircraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detalles de la Aeronave</h2>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Básica</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-600">ID</label>
                  <p className="text-gray-900">{viewingAircraft.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Matrícula</label>
                  <p className="text-gray-900">{viewingAircraft.matricula || 'No especificada'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Modelo</label>
                  <p className="text-gray-900">{viewingAircraft.model}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Nombre de la Aeronave</label>
                  <p className="text-gray-900">{viewingAircraft.nombreAeronave || 'No especificado'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Compañía</label>
                  <p className="text-gray-900">{viewingAircraft.compania || 'No especificada'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Capacidad</label>
                  <p className="text-gray-900">{viewingAircraft.capacity} pasajeros</p>
                </div>
              </div>

              {/* Technical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Técnica</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Tipo de Aeronave</label>
                  <p className="text-gray-900">{viewingAircraft.tipoAeronave || 'No especificado'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Clase de Servicio</label>
                  <p className="text-gray-900">{viewingAircraft.claseServicio || 'No especificada'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Accesibilidad</label>
                  <p className="text-gray-900">{viewingAircraft.accesibilidadAeronave || 'No especificada'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Entretenimiento</label>
                  <p className="text-gray-900">{viewingAircraft.entretenimientoAeronave || 'No especificado'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Tipo de Combustible</label>
                  <p className="text-gray-900">{viewingAircraft.combustibleAeronave || 'No especificado'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Certificado de Aeronave</label>
                  <p className="text-gray-900">{viewingAircraft.certificadoAeronave || 'No disponible'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Manual de Operación</label>
                  <p className="text-gray-900">{viewingAircraft.manualOperacion || 'No disponible'}</p>
                </div>

                {viewingAircraft.created_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Fecha de Registro</label>
                    <p className="text-gray-900">{new Date(viewingAircraft.created_at).toLocaleDateString('es-ES')}</p>
                  </div>
                )}

                {viewingAircraft.relacionAeropuerto && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Relación Aeropuerto</label>
                    <p className="text-gray-900">{viewingAircraft.relacionAeropuerto}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeDetailsModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AircraftManagement;