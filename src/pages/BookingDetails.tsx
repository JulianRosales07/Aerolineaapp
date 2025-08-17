import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Calendar, Phone, Mail, MapPin } from 'lucide-react';

const BookingDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengers } = location.state || {};

  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    phone: '',
    email: '',
    confirmEmail: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleContinue = () => {
    if (bookingData.email !== bookingData.confirmEmail) {
      alert('Los correos electrónicos no coinciden');
      return;
    }
    
    navigate('/customize-trip', { state: { flight, passengers, bookingData } });
  };

  const isFormValid = () => {
    return Object.values(bookingData).every(value => value.trim() !== '') &&
           bookingData.email === bookingData.confirmEmail;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Datos del Pasajero</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Nombres *
                  </label>
                  <input
                    type="text"
                    value={bookingData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Juan Carlos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={bookingData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Pérez González"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Género *</label>
                  <select
                    value={bookingData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    value={bookingData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Nacionalidad *
                  </label>
                  <select
                    value={bookingData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar nacionalidad</option>
                    <option value="Colombiana">Colombiana</option>
                    <option value="Estadounidense">Estadounidense</option>
                    <option value="Mexicana">Mexicana</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Brasileña">Brasileña</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Pasaporte *
                  </label>
                  <input
                    type="text"
                    value={bookingData.passportNumber}
                    onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="AB1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Confirmar Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={bookingData.confirmEmail}
                    onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!isFormValid()}
                className="w-full mt-8 bg-sky-500 text-white py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-300"
              >
                Continuar
              </button>
            </div>
          </div>

          {/* Flight Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Resumen del Vuelo</h3>
              
              {flight && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ruta:</span>
                    <span className="font-semibold">{flight.origin} → {flight.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-semibold">{flight.departureDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora:</span>
                    <span className="font-semibold">{flight.departureTime} - {flight.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-semibold">{flight.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pasajeros:</span>
                    <span className="font-semibold">
                      {passengers ? 
                        passengers.adults + passengers.youth + passengers.children + passengers.infants 
                        : 1
                      }
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-sky-500">
                        ${(flight.price * 
                          (passengers ? 
                            passengers.adults + passengers.youth + passengers.children + passengers.infants 
                            : 1)
                        ).toLocaleString()} COP
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;