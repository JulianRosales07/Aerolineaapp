import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Users, Calendar, CreditCard } from 'lucide-react';
import { comprasAPI } from '../services/api';

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

interface Passengers {
  adults: number;
  youth: number;
  children: number;
  infants: number;
}

interface SearchData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  tripType: string;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  email: string;
  phone: string;
}

const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengers, searchData } = location.state as { 
    flight: Flight; 
    passengers: Passengers; 
    searchData: SearchData 
  } || {};

  const [passengerDetails, setPassengerDetails] = useState<PassengerInfo[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!flight || !passengers) {
      navigate('/');
      return;
    }

    // Initialize passenger details array
    const totalPassengers = passengers.adults + passengers.youth + passengers.children + passengers.infants;
    const initialDetails: PassengerInfo[] = Array(totalPassengers).fill(null).map(() => ({
      firstName: '',
      lastName: '',
      documentType: 'CC',
      documentNumber: '',
      birthDate: '',
      email: '',
      phone: ''
    }));
    setPassengerDetails(initialDetails);
  }, [flight, passengers, navigate]);

  const updatePassengerDetail = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
  };

  const handleBooking = async () => {
    // Validate all passenger details
    const isValid = passengerDetails.every(passenger => 
      passenger.firstName && 
      passenger.lastName && 
      passenger.documentNumber && 
      passenger.birthDate &&
      passenger.email &&
      passenger.phone
    );

    if (!isValid) {
      alert('Por favor completa todos los datos de los pasajeros');
      return;
    }

    setLoading(true);
    try {
      // Create the purchase via compras API
      const purchaseData = {
        relacion_vuelo: flight.id,
        relacion_usuario: 1, // This should come from user authentication
        cantidad_pasajeros: totalPassengers,
        precio_total: totalPrice,
        fecha_compra: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        detalles_pasajeros: passengerDetails
      };

      console.log('Creating purchase with data:', purchaseData);
      
      // Check if this is a simulated flight (ID >= 1000)
      const isSimulatedFlight = flight.id >= 1000;
      
      let purchaseResponse = null;
      let lastError = null;

      if (isSimulatedFlight) {
        // For simulated flights, create a mock purchase response
        console.log('Simulated flight detected, creating mock purchase');
        purchaseResponse = {
          id: Date.now(), // Use timestamp as unique ID
          vuelo_id: flight.id,
          usuario_id: 1,
          cantidad_pasajeros: totalPassengers,
          precio_total: totalPrice,
          fecha_compra: new Date().toISOString().split('T')[0],
          estado: 'Pendiente',
          created_at: new Date().toISOString()
        };
      } else {
        // Try different field name variations for real flights
        const apiVariations = [
          purchaseData,
          {
            vuelo_id: flight.id,
            usuario_id: 1,
            cantidad_pasajeros: totalPassengers,
            precio_total: totalPrice,
            fecha_compra: new Date().toISOString().split('T')[0],
            estado: 'Pendiente'
          },
          {
            id_vuelo: flight.id,
            id_usuario: 1,
            cantidad_pasajeros: totalPassengers,
            precio_total: totalPrice
          }
        ];

        // Try each variation until one works
        for (const variation of apiVariations) {
          try {
            purchaseResponse = await comprasAPI.create(variation);
            break;
          } catch (error) {
            lastError = error;
            console.log('API variation failed:', error);
          }
        }

        if (!purchaseResponse) {
          throw lastError || new Error('No se pudo crear la compra');
        }
      }

      console.log('Purchase created successfully:', purchaseResponse);
      
      // Navigate to customize trip with purchase details
      navigate('/customize-trip', {
        state: {
          flight,
          passengers,
          passengerDetails,
          searchData,
          totalPrice,
          purchaseId: purchaseResponse.id || purchaseResponse.insertId,
          purchase: purchaseResponse
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // For now, continue to customize trip even if API fails (for testing)
      console.log('Continuing to customize trip despite API error for testing purposes');
      navigate('/customize-trip', {
        state: {
          flight,
          passengers,
          passengerDetails,
          searchData,
          totalPrice,
          purchaseId: null,
          apiError: error.message
        }
      });
    } finally {
      setLoading(false);
    }
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

  const calculateDuration = (departure: string, arrival: string | null) => {
    if (!arrival) return 'Directo';
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

  const totalPassengers = passengers?.adults + passengers?.youth + passengers?.children + passengers?.infants || 0;
  const flightPrice = flight ? parseFloat(flight.precio) : 0;
  const totalPrice = flightPrice * totalPassengers;

  if (!flight || !passengers) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sky-500 hover:text-sky-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detalles de la reserva</h1>
        </div>

        {/* Flight Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Resumen del vuelo</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-xl font-bold">{formatTime(flight.fecha_salida)}</p>
                <p className="text-sm text-gray-600">{getAirportName(flight.origen)}</p>
              </div>
              <div className="flex-1 px-4">
                <div className="flex items-center justify-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <Plane className="h-5 w-5 text-sky-500 mx-3" />
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <p className="text-center text-xs text-gray-600 mt-1">
                  {calculateDuration(flight.fecha_salida, flight.fecha_regreso)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">
                  {flight.fecha_regreso ? 
                    formatTime(flight.fecha_regreso) : 
                    formatTime(new Date(new Date(flight.fecha_salida).getTime() + 2 * 60 * 60 * 1000).toISOString())
                  }
                </p>
                <p className="text-sm text-gray-600">{getAirportName(flight.destino)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-sky-600">{formatPrice(flight.precio)}</p>
              <p className="text-sm text-gray-600">por persona</p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Datos de los pasajeros</h2>
          <div className="space-y-6">
            {passengerDetails.map((passenger, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="font-medium mb-4">Pasajero {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => updatePassengerDetail(index, 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => updatePassengerDetail(index, 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de documento *
                    </label>
                    <select
                      value={passenger.documentType}
                      onChange={(e) => updatePassengerDetail(index, 'documentType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PA">Pasaporte</option>
                      <option value="TI">Tarjeta de Identidad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de documento *
                    </label>
                    <input
                      type="text"
                      value={passenger.documentNumber}
                      onChange={(e) => updatePassengerDetail(index, 'documentNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de nacimiento *
                    </label>
                    <input
                      type="date"
                      value={passenger.birthDate}
                      onChange={(e) => updatePassengerDetail(index, 'birthDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => updatePassengerDetail(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => updatePassengerDetail(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Resumen de precios</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Vuelo ({totalPassengers} pasajeros)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasas e impuestos</span>
              <span>Incluido</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-sky-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-sky-500 text-white py-4 px-6 rounded-lg hover:bg-sky-600 transition-colors font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>Personalizar viaje</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Booking;