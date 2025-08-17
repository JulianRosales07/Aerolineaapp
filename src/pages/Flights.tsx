import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, ArrowRight, Users, Calendar } from 'lucide-react';
import { vuelosAPI } from '../services/api';

interface Flight {
  id: number;
  origen: string;
  destino: string;
  fecha_salida: string;
  fecha_regreso: string | null;
  precio: string;
  capacidad: number;
  estado: string;
  relacion_aeronave: number;
  created_at: string;
}

interface SearchData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  tripType: string;
}

interface Passengers {
  adults: number;
  youth: number;
  children: number;
  infants: number;
}

const Flights: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchData, passengers } = location.state as { searchData: SearchData; passengers: Passengers } || {};

  const generateSimulatedFlights = (searchData: SearchData, searchParams: any): Flight[] => {
    const basePrice = getBasePrice(searchData.origin, searchData.destination);
    const departureDate = new Date(searchData.departureDate);
    
    const simulatedFlights: Flight[] = [];
    
    // Generar 3-5 vuelos simulados con diferentes horarios y precios
    const flightTimes = [
      { departure: '06:00', arrival: '08:30', priceMultiplier: 0.9 },
      { departure: '10:15', arrival: '12:45', priceMultiplier: 1.0 },
      { departure: '14:30', arrival: '17:00', priceMultiplier: 1.1 },
      { departure: '18:45', arrival: '21:15', priceMultiplier: 0.95 },
      { departure: '22:00', arrival: '00:30', priceMultiplier: 0.85 }
    ];
    
    flightTimes.forEach((time, index) => {
      const [depHour, depMin] = time.departure.split(':').map(Number);
      const [arrHour, arrMin] = time.arrival.split(':').map(Number);
      
      const departureDateTime = new Date(departureDate);
      departureDateTime.setHours(depHour, depMin, 0, 0);
      
      const arrivalDateTime = new Date(departureDate);
      arrivalDateTime.setHours(arrHour, arrMin, 0, 0);
      
      // Si la llegada es al día siguiente (vuelos nocturnos)
      if (arrHour < depHour) {
        arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
      }
      
      const price = Math.round(basePrice * time.priceMultiplier);
      
      simulatedFlights.push({
        id: 1000 + index + 1, // ID único para vuelos simulados (empezando desde 1001)
        origen: searchData.origin,
        destino: searchData.destination,
        fecha_salida: departureDateTime.toISOString(),
        fecha_regreso: searchData.tripType === 'roundtrip' && searchData.returnDate ? 
          new Date(searchData.returnDate + 'T' + time.arrival + ':00').toISOString() : null,
        precio: price.toString(),
        capacidad: Math.floor(Math.random() * 100) + 150, // Entre 150-250 asientos
        estado: 'Disponible',
        relacion_aeronave: index + 1,
        created_at: new Date().toISOString()
      });
    });
    
    return simulatedFlights.slice(0, Math.floor(Math.random() * 3) + 3); // 3-5 vuelos
  };

  const getBasePrice = (origin: string, destination: string): number => {
    // Precios base simulados según la ruta
    const routePrices: { [key: string]: number } = {
      'MEX-BOG': 650000,
      'BOG-MEX': 650000,
      'BOG-MDE': 180000,
      'MDE-BOG': 180000,
      'BOG-CTG': 220000,
      'CTG-BOG': 220000,
      'BOG-CLO': 160000,
      'CLO-BOG': 160000,
      'MDE-CTG': 280000,
      'CTG-MDE': 280000,
      'MDE-CLO': 200000,
      'CLO-MDE': 200000,
      'CTG-CLO': 320000,
      'CLO-CTG': 320000
    };
    
    const routeKey = `${origin}-${destination}`;
    return routePrices[routeKey] || 400000; // Precio por defecto
  };

  useEffect(() => {
    if (!searchData) {
      navigate('/');
      return;
    }

    const searchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const totalPassengers = passengers.adults + passengers.youth + passengers.children + passengers.infants;
        
        const searchParams = {
          origin: searchData.origin,
          destination: searchData.destination,
          departureDate: searchData.departureDate,
          ...(searchData.tripType === 'roundtrip' && searchData.returnDate && { returnDate: searchData.returnDate }),
          passengers: totalPassengers
        };

        const response = await vuelosAPI.getAll();
        let flights = Array.isArray(response) ? response : (response.data || []);
        
        // Filter flights based on search criteria
        flights = flights.filter((flight: Flight) => {
          const matchesOrigin = !searchParams.origin || flight.origen === searchParams.origin;
          const matchesDestination = !searchParams.destination || flight.destino === searchParams.destination;
          const matchesDate = !searchParams.departureDate || 
            new Date(flight.fecha_salida).toDateString() === new Date(searchParams.departureDate).toDateString();
          
          return matchesOrigin && matchesDestination && matchesDate;
        });
        
        // Si no hay vuelos reales, generar vuelos simulados
        if (flights.length === 0) {
          flights = generateSimulatedFlights(searchData, searchParams);
        }
        
        setFlights(flights);
      } catch (err) {
        console.error('Error searching flights:', err);
        setError('Error al buscar vuelos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    searchFlights();
  }, [searchData, passengers, navigate]);

  const handleFlightSelect = (flight: Flight) => {
    // Navigate to booking page with flight and passenger data
    navigate('/booking', { 
      state: { 
        flight, 
        passengers, 
        searchData 
      } 
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numPrice);
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const getAirportName = (code: string) => {
    const airports: { [key: string]: string } = {
      'BOG': 'Bogotá',
      'MDE': 'Medellín',
      'CTG': 'Cartagena',
      'CLO': 'Cali',
      'MEX': 'Ciudad de México',
      'EZE': 'Buenos Aires'
    };
    return airports[code] || code;
  };

  if (!searchData) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Buscando vuelos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{getAirportName(searchData.origin)}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">{getAirportName(searchData.destination)}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(searchData.departureDate).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{passengers.adults + passengers.youth + passengers.children + passengers.infants} pasajeros</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sky-500 hover:text-sky-600 font-medium"
            >
              Modificar búsqueda
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vuelos disponibles
          </h1>
          <p className="text-gray-600">
            {flights.length} vuelos encontrados
          </p>
        </div>

        {/* Flight Results */}
        {flights.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron vuelos
            </h3>
            <p className="text-gray-600 mb-4">
              No hay vuelos disponibles para los criterios de búsqueda seleccionados.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors"
            >
              Buscar otros vuelos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatTime(flight.fecha_salida)}
                          </p>
                          <p className="text-sm text-gray-600">{getAirportName(flight.origen)}</p>
                        </div>
                        
                        <div className="flex-1 px-4">
                          <div className="flex items-center justify-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <div className="px-3 text-center">
                              <Plane className="h-5 w-5 text-sky-500 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">
                                {flight.fecha_regreso ? 
                                  calculateDuration(flight.fecha_salida, flight.fecha_regreso) : 
                                  'Directo'
                                }
                              </p>
                            </div>
                            <div className="flex-1 border-t border-gray-300"></div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {flight.fecha_regreso ? 
                              formatTime(flight.fecha_regreso) : 
                              formatTime(new Date(new Date(flight.fecha_salida).getTime() + 2 * 60 * 60 * 1000).toISOString())
                            }
                          </p>
                          <p className="text-sm text-gray-600">{getAirportName(flight.destino)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>AeroColombiana</span>
                      <span>•</span>
                      <span>Aeronave {flight.relacion_aeronave}</span>
                      <span>•</span>
                      <span>{flight.capacidad} asientos disponibles</span>
                      <span>•</span>
                      <span className="capitalize">{flight.estado}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 text-center lg:text-right">
                    <p className="text-2xl font-bold text-sky-600 mb-2">
                      {formatPrice(flight.precio)}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">por persona</p>
                    <button
                      onClick={() => handleFlightSelect(flight)}
                      className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium"
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;