import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowRight } from 'lucide-react';

const TicketTest: React.FC = () => {
  const navigate = useNavigate();

  const handleTestTicket = () => {
    // Datos de prueba para el ticket
    const testData = {
      bookingReference: `AC${Date.now().toString().slice(-6)}`,
      flight: {
        origin: 'BOG',
        destination: 'MDE',
        departureTime: '08:00',
        arrivalTime: '09:15',
        departureDate: '2024-02-15',
        duration: '1h 15m',
        aircraft: 'Boeing 737-800'
      },
      bookingData: {
        firstName: 'Juan Carlos',
        lastName: 'Pérez García',
        email: 'juan.perez@email.com',
        phone: '+57 300 123 4567',
        nationality: 'Colombiana'
      },
      selectedSeat: '12F',
      selectedServices: [
        { name: 'Comida a bordo', price: 25000 },
        { name: 'Equipaje adicional', price: 35000 },
        { name: 'Selección de asiento', price: 15000 }
      ],
      totalAmount: 255000
    };

    // Navegar a la página de ticket con los datos de prueba
    navigate('/ticket', { state: testData });
  };

  const handleTestEmptyTicket = () => {
    // Navegar sin datos para probar el ticket vacío
    navigate('/ticket');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Prueba de Tickets</h1>
          <p className="text-gray-600">Prueba la funcionalidad de generación de tickets</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Ticket con Datos Completos</h3>
            <p className="text-gray-600 text-sm mb-4">
              Genera un ticket con datos de ejemplo completos para ver cómo se ve un ticket real.
            </p>
            <button
              onClick={handleTestTicket}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plane className="h-5 w-5" />
              <span>Ver Ticket Completo</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Ticket de Ejemplo</h3>
            <p className="text-gray-600 text-sm mb-4">
              Genera un ticket con datos por defecto para ver cómo maneja la aplicación los casos sin datos.
            </p>
            <button
              onClick={handleTestEmptyTicket}
              className="w-full border border-blue-500 text-blue-500 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Plane className="h-5 w-5" />
              <span>Ver Ticket de Ejemplo</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Instrucciones</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Haz clic en cualquier opción para ir a la página de ticket</li>
              <li>• Una vez allí, usa el botón "Descargar Ticket" para generar el archivo</li>
              <li>• El ticket se descargará como HTML y se abrirá para imprimir como PDF</li>
              <li>• Puedes usar Ctrl+P o Cmd+P para guardar como PDF desde el navegador</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketTest;