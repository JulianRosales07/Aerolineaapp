import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const CustomizeTrip: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengers, passengerDetails, searchData, totalPrice, purchaseId, purchase } = location.state || {};

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services = [
    {
      id: 'wheelchair',
      name: 'Asistencia en silla de ruedas',
      description: 'Servicio de silla de ruedas en aeropuerto',
      price: 0
    },
    {
      id: 'meal',
      name: 'Comida especial',
      description: 'Menú vegetariano, vegano o sin gluten',
      price: 25000
    },
    {
      id: 'priority-boarding',
      name: 'Embarque prioritario',
      description: 'Accede al avión antes que el resto de pasajeros',
      price: 35000
    },
    {
      id: 'extra-luggage',
      name: 'Equipaje adicional',
      description: '23kg adicionales de equipaje facturado',
      price: 80000
    },
    {
      id: 'lounge-access',
      name: 'Acceso a sala VIP',
      description: 'Acceso a nuestra sala VIP en el aeropuerto',
      price: 120000
    },
    {
      id: 'premium-seat',
      name: 'Asiento premium',
      description: 'Asiento con mayor espacio para las piernas',
      price: 150000
    }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getTotalServices = () => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.price, 0);
  };

  const handleContinue = () => {
    const customizedServices = services.filter(service => 
      selectedServices.includes(service.id)
    );
    
    navigate('/seat-selection', {
      state: {
        flight,
        passengers,
        passengerDetails,
        searchData,
        totalPrice,
        purchaseId,
        purchase,
        selectedServices: customizedServices
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Personaliza tu Viaje</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Servicios Especiales</h2>
              
              <div className="space-y-4">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedServices.includes(service.id) 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedServices.includes(service.id)
                            ? 'bg-sky-500 border-sky-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedServices.includes(service.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {service.price === 0 ? 'Gratis' : `$${service.price.toLocaleString()} COP`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleContinue}
                className="w-full bg-sky-500 text-white py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors"
              >
                Continuar a Selección de Asientos
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Resumen</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vuelo:</span>
                  <span className="font-semibold">
                    ${flight?.price.toLocaleString()} COP
                  </span>
                </div>
                
                {selectedServices.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Servicios adicionales:</div>
                    {services
                      .filter(service => selectedServices.includes(service.id))
                      .map(service => (
                        <div key={service.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{service.name}:</span>
                          <span>
                            {service.price === 0 ? 'Gratis' : `$${service.price.toLocaleString()}`}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-sky-500">
                      ${((flight?.price || 0) + getTotalServices()).toLocaleString()} COP
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p className="font-medium mb-2">Pasajero:</p>
                <p>{passengerDetails?.[0]?.firstName} {passengerDetails?.[0]?.lastName}</p>
                <p>{passengerDetails?.[0]?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeTrip;