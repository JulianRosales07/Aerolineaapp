import React, { useState } from 'react';
import { Search, Plane, Clock, User, Luggage, MapPin, QrCode } from 'lucide-react';
import { checkinAPI } from '../services/api';

const CheckIn: React.FC = () => {
  const [checkInData, setCheckInData] = useState({
    bookingReference: '',
    lastName: ''
  });
  const [checkedIn, setCheckedIn] = useState(false);
  const [flightInfo, setFlightInfo] = useState<any>(null);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Intentar buscar el check-in en la API
      const checkinData = {
        bookingReference: checkInData.bookingReference,
        lastName: checkInData.lastName,
        checkinTime: new Date().toISOString(),
        status: 'completed'
      };

      // Crear registro de check-in
      await checkinAPI.create(checkinData);

      // Simular información del vuelo (en una app real vendría de la API)
      const mockFlightInfo = {
        bookingReference: checkInData.bookingReference,
        passenger: `${checkInData.lastName}, Juan Carlos`,
        flight: 'AC1234',
        origin: 'BOG - Bogotá',
        destination: 'MDE - Medellín',
        date: '2024-02-15',
        departureTime: '08:00',
        gate: 'A12',
        seat: '12F',
        boardingTime: '07:30'
      };

      setFlightInfo(mockFlightInfo);
      setCheckedIn(true);
    } catch (error) {
      console.error('Error during check-in:', error);
      alert('Error al realizar el check-in. Verifica tus datos e intenta de nuevo.');
    }
  };

  const checkInSteps = [
    {
      step: 1,
      title: 'Ingresa tus datos',
      description: 'Código de reserva y apellido del pasajero principal',
      icon: Search
    },
    {
      step: 2,
      title: 'Confirma tu información',
      description: 'Verifica los datos del vuelo y pasajero',
      icon: User
    },
    {
      step: 3,
      title: 'Obtén tu pase de abordar',
      description: 'Descarga o envía por email tu boarding pass',
      icon: QrCode
    }
  ];

  const checkInTips = [
    {
      icon: Clock,
      title: 'Check-in Online',
      description: 'Disponible desde 24 horas hasta 1 hora antes del vuelo'
    },
    {
      icon: Luggage,
      title: 'Equipaje',
      description: 'Si tienes equipaje para facturar, dirígete al mostrador'
    },
    {
      icon: MapPin,
      title: 'Llega temprano',
      description: '2 horas antes para vuelos nacionales, 3 horas para internacionales'
    }
  ];

  if (checkedIn && flightInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">¡Check-in Completado!</h1>
            <p className="text-gray-600">Tu pase de abordar está listo</p>
          </div>

          {/* Boarding Pass */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-sky-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Plane className="h-8 w-8" />
                  <span className="text-2xl font-bold">AeroColombiana</span>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Vuelo</div>
                  <div className="text-xl font-bold">{flightInfo.flight}</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Pasajero</div>
                  <div className="font-semibold">{flightInfo.passenger}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Código de reserva</div>
                  <div className="font-semibold">{flightInfo.bookingReference}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Asiento</div>
                  <div className="font-semibold">{flightInfo.seat}</div>
                </div>
              </div>

              <div className="border-t border-dashed pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Origen</div>
                    <div className="font-semibold">{flightInfo.origin}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Destino</div>
                    <div className="font-semibold">{flightInfo.destination}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Fecha</div>
                    <div className="font-semibold">{flightInfo.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Salida</div>
                    <div className="font-semibold">{flightInfo.departureTime}</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <QrCode className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-800">
                      Puerta: {flightInfo.gate} | Embarque: {flightInfo.boardingTime}
                    </div>
                    <div className="text-sm text-yellow-700">
                      Preséntate en la puerta de embarque 30 minutos antes
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button className="flex-1 bg-sky-500 text-white py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors">
                  Descargar PDF
                </button>
                <button className="flex-1 border border-sky-500 text-sky-500 py-3 px-6 rounded-lg hover:bg-sky-50 transition-colors">
                  Enviar por Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Check-in Online</h1>
          <p className="text-xl opacity-90">Ahorra tiempo y haz tu check-in desde casa</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Check-in Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Realizar Check-in</h2>
              
              <form onSubmit={handleCheckIn} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Reserva *
                  </label>
                  <input
                    type="text"
                    value={checkInData.bookingReference}
                    onChange={(e) => setCheckInData({ ...checkInData, bookingReference: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="AC123456"
                    maxLength={8}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido del Pasajero Principal *
                  </label>
                  <input
                    type="text"
                    value={checkInData.lastName}
                    onChange={(e) => setCheckInData({ ...checkInData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Pérez"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-500 text-white py-4 px-6 rounded-lg hover:bg-sky-600 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Buscar Reserva</span>
                </button>
              </form>
            </div>

            {/* Tips */}
            <div className="mt-8 space-y-4">
              {checkInTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md flex items-center space-x-4">
                  <div className="bg-sky-100 p-3 rounded-lg">
                    <tip.icon className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div>
            <h3 className="text-2xl font-bold mb-8">¿Cómo hacer check-in?</h3>
            
            <div className="space-y-6">
              {checkInSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-sky-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h4 className="font-semibold text-blue-800 mb-4">Información Importante</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• El check-in online cierra 1 hora antes del vuelo</li>
                <li>• Si tienes equipaje especial, dirígete al mostrador</li>
                <li>• Menores no acompañados deben hacer check-in en mostrador</li>
                <li>• Guarda tu pase de abordar en el móvil o imprímelo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;