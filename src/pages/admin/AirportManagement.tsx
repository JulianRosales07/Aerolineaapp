import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { aeropuertosAPI } from '../../services/api';

const AirportManagement: React.FC = () => {
  const { airports, addAirport, updateAirport, deleteAirport, loadAirportsFromAPI } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    city: ''
  });

  // Cargar datos al montar el componente
  React.useEffect(() => {
    loadAirportsFromAPI();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const airportData = {
      codigo: formData.code.toUpperCase(),
      nombreAeropuerto: formData.name,
      ciudadAeropuerto: formData.city,
      tipoAeropuerto: editingAirport?.tipoAeropuerto || 'Internacional',
      estadoPistas: editingAirport?.estadoPistas || 'Activo',
      balancePeso: editingAirport?.balancePeso || 'OK',
      equipamientoEmergencia: editingAirport?.equipamientoEmergencia || 'Extintores',
      chequeoSistemas: editingAirport?.chequeoSistemas || 'Chequeo completo',
      relacionRuta1: editingAirport?.relacionRuta1 || 1,
      relacionRuta2: editingAirport?.relacionRuta2 || 2
    };

    try {
      if (editingAirport) {
        await aeropuertosAPI.update(editingAirport.id, airportData);
        updateAirport(editingAirport.id, { ...airportData, id: editingAirport.id });
      } else {
        const newAirport = await aeropuertosAPI.create(airportData);
        addAirport(newAirport);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving airport:', error);
      alert('Error al guardar el aeropuerto. Intenta de nuevo.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ code: '', name: '', city: '' });
    setEditingAirport(null);
    setIsModalOpen(false);
  };

  const handleEdit = (airport: any) => {
    setEditingAirport(airport);
    setFormData({
      code: airport.code,
      name: airport.name,
      city: airport.city
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este aeropuerto?')) {
      setLoading(true);
      aeropuertosAPI.delete(id)
        .then(() => {
          deleteAirport(id);
        })
        .catch((error) => {
          console.error('Error deleting airport:', error);
          alert('Error al eliminar el aeropuerto. Intenta de nuevo.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Aeropuertos</h1>
          <p className="text-gray-600">Administra los aeropuertos de la red</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Aeropuerto</span>
        </button>
      </div>

      {/* Airports List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {airports.map((airport, index) => (
                <tr key={airport.id || `airport-${airport.code}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{airport.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-sky-100 p-2 rounded-lg mr-3">
                        <span className="text-sky-700 font-bold text-sm">{airport.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{airport.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <div className="text-sm text-gray-900">{airport.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(airport)}
                        className="text-sky-600 hover:text-sky-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(airport.id)}
                        className="text-red-600 hover:text-red-900"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingAirport ? 'Editar Aeropuerto' : 'Agregar Nuevo Aeropuerto'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código del Aeropuerto
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent uppercase"
                    placeholder="BOG"
                    maxLength={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Aeropuerto
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="El Dorado"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Bogotá"
                    required
                  />
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
                  {loading ? 'Guardando...' : (editingAirport ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportManagement;