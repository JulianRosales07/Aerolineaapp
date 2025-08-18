import React, { useState, useEffect } from 'react';
import { Search, Users, Plane, Shield, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PassengerModal from '../components/PassengerModal';
import { aeropuertosAPI } from '../services/api';
import { tiquetesAPI } from '../services/tiquetesAPI';

interface Airport {
  id: string;
  codigo: string;
  nombre: string;
  ciudad: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    tripType: 'roundtrip'
  });
  const [passengers, setPassengers] = useState({ adults: 1, youth: 0, children: 0, infants: 0 });
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAirports = async () => {
      try {
        const response = await aeropuertosAPI.getAll();
        setAirports(response.data || response || []);
      } catch (error) {
        console.error('Error loading airports:', error);
        // Fallback to default airports if API fails
        setAirports([
          { id: '1', codigo: 'BOG', nombre: 'El Dorado', ciudad: 'Bogotá' },
          { id: '2', codigo: 'MDE', nombre: 'José María Córdova', ciudad: 'Medellín' },
          { id: '3', codigo: 'CTG', nombre: 'Rafael Núñez', ciudad: 'Cartagena' },
          { id: '4', codigo: 'CLO', nombre: 'Alfonso Bonilla Aragón', ciudad: 'Cali' },
          { id: '5', codigo: 'MEX', nombre: 'Benito Juárez', ciudad: 'Ciudad de México' },
          { id: '6', codigo: 'EZE', nombre: 'Ezeiza', ciudad: 'Buenos Aires' }
        ]);
      }
    };

    loadAirports();
  }, []);

  const handleSearch = async () => {
    if (searchData.origin && searchData.destination && searchData.departureDate) {
      // Validate that departure date is not in the past
      const today = new Date();
      const departureDate = new Date(searchData.departureDate);
      
      if (departureDate < today) {
        alert('La fecha de salida no puede ser anterior a hoy');
        return;
      }

      // Validate return date if it's a round trip
      if (searchData.tripType === 'roundtrip' && searchData.returnDate) {
        const returnDate = new Date(searchData.returnDate);
        if (returnDate < departureDate) {
          alert('La fecha de regreso no puede ser anterior a la fecha de salida');
          return;
        }
      }

      // Validate that origin and destination are different
      if (searchData.origin === searchData.destination) {
        alert('El origen y destino deben ser diferentes');
        return;
      }

      setLoading(true);
      try {
        // Build ticket payload (ajusta los campos al esquema real de tu API)
        const ticketPayload = {
          usuarioId: 1, // reemplaza con el id real del usuario si lo tienes
          vueloId: null, // si ya tienes un vuelo seleccionado, pon su id aquí
          fecha_creacion: new Date().toISOString(), // opcional, el backend puede generar esta fecha
          fecha_viaje: searchData.departureDate,
          origen: searchData.origin,
          destino: searchData.destination,
          equipaje: `${passengers.adults} adultos, ${passengers.youth} jóvenes, ${passengers.children} niños, ${passengers.infants} infantes`,
          clase: 'Económica', // o escoger según la selección del usuario
          cantidad_pasajeros: passengers.adults + passengers.youth + passengers.children + passengers.infants
        };

        // Enviar ticket al backend
        const response = await tiquetesAPI.create(ticketPayload);
        const savedTicket = response.data;

        // Navegar a la página de resultados/pago pasando el ticket guardado
        navigate('/flights', { state: { searchData, passengers, ticket: savedTicket } });
      } catch (error) {
        console.error('Error al guardar el ticket:', error);
        alert('Error al guardar el ticket. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  };

  const getPassengerText = () => {
    const total = passengers.adults + passengers.youth + passengers.children + passengers.infants;
    return `${total} pasajero${total > 1 ? 's' : ''}`;
  };

  const offers = [
    {
      title: 'Cartagena - El Caribe te espera',
      description: 'Vuelos desde $180.000 COP',
      image: 'https://media.staticontent.com/media/pictures/9495889e-54f9-40d2-939d-b04bf30b47c7'
    },
    {
      title: 'Medellín - Ciudad de la Eterna Primavera',
      description: 'Vuelos desde $150.000 COP',
      image: 'https://www.ciencuadras.com/blog/wp-content/uploads/2023/06/Medellin-barrios-principales-historia-inmuebles.jpg'
    },
    {
      title: 'San Andrés - Paraíso Colombiano',
      description: 'Vuelos desde $320.000 COP',
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/88/76/decameron-aquarium.jpg?w=600&h=400&s=1'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Vuela con <span className="text-sky-400">NovaAir</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">Conectamos Colombia con el mundo</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative -mt-32 z-10 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="mb-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="roundtrip"
                  checked={searchData.tripType === 'roundtrip'}
                  onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
                  className="mr-2"
                />
                Ida y vuelta
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="oneway"
                  checked={searchData.tripType === 'oneway'}
                  onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
                  className="mr-2"
                />
                Solo ida
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Origen</label>
              <select
                value={searchData.origin}
                onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar origen</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.codigo}>
                    {airport.ciudad} ({airport.codigo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
              <select
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar destino</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.codigo}>
                    {airport.ciudad} ({airport.codigo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de salida</label>
              <input
                type="date"
                value={searchData.departureDate}
                onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {searchData.tripType === 'roundtrip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de regreso</label>
                <input
                  type="date"
                  value={searchData.returnDate}
                  onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pasajeros</label>
              <button
                onClick={() => setShowPassengerModal(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-left flex items-center justify-between"
              >
                <span>{getPassengerText()}</span>
                <Users className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-sky-500 text-white py-4 px-6 rounded-lg hover:bg-sky-600 transition-colors font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Buscar vuelos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ofertas Especiales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <button className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Check-in Online</h3>
              <p className="text-gray-600">Realiza tu check-in desde casa y ahorra tiempo en el aeropuerto.</p>
            </div>
            <div className="text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Viaja Seguro</h3>
              <p className="text-gray-600">Cumplimos con todos los protocolos de seguridad y bioseguridad.</p>
            </div>
            <div className="text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Puntualidad</h3>
              <p className="text-gray-600">Más del 95% de nuestros vuelos salen a tiempo.</p>
            </div>
            <div className="text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mejor Aerolínea</h3>
              <p className="text-gray-600">Reconocida como la mejor aerolínea nacional por 3 años consecutivos.</p>
            </div>
          </div>
        </div>
      </div>

      <PassengerModal
        isOpen={showPassengerModal}
        onClose={() => setShowPassengerModal(false)}
        onConfirm={setPassengers}
        initialPassengers={passengers}
      />
    </div>
  );
};

export default Home;