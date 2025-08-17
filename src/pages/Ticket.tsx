import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Calendar, Clock, MapPin, User, Download, Check, AlertCircle } from 'lucide-react';
import { generateTicketPDF } from '../utils/ticketGenerator';
import { tiquetesAPI } from '../services/api';

const Ticket: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Extraer datos del estado de navegación con valores por defecto
  const {
    bookingReference = `AC${Date.now().toString().slice(-6)}`,
    flight = {
      origin: 'BOG',
      destination: 'MDE',
      departureTime: '08:00',
      arrivalTime: '09:15',
      departureDate: new Date().toISOString().split('T')[0],
      duration: '1h 15m',
      aircraft: 'Boeing 737'
    },
    bookingData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@email.com',
      phone: '+57 300 123 4567',
      nationality: 'Colombiana'
    },
    selectedSeat = '12F',
    selectedServices = [],
    totalAmount = 180000
  } = location.state || {};

  // Verificar si tenemos datos válidos
  const hasValidData = location.state && location.state.bookingReference;

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setDownloadStatus('idle');

    try {
      // Preparar datos del ticket
      const ticketData = {
        bookingReference,
        flight,
        bookingData,
        selectedSeat,
        selectedServices,
        totalAmount,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Intentar guardar en la API solo si tenemos datos reales
      if (hasValidData) {
        try {
          await tiquetesAPI.create(ticketData);
          console.log('Ticket guardado en la base de datos');
        } catch (apiError) {
          console.warn('No se pudo guardar en la API, continuando con descarga:', apiError);
        }
      }

      // Generar y descargar el ticket
      generateTicketPDF(ticketData);
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error al descargar el ticket:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNewBooking = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            hasValidData ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {hasValidData ? (
              <Check className="h-10 w-10 text-green-500" />
            ) : (
              <Plane className="h-10 w-10 text-blue-500" />
            )}
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            hasValidData ? 'text-green-600' : 'text-blue-600'
          }`}>
            {hasValidData ? '¡Pago Exitoso!' : 'Ticket de Ejemplo'}
          </h1>
          <p className="text-gray-600">
            {hasValidData ? 'Tu reserva ha sido confirmada' : 'Vista previa del ticket'}
          </p>
          {!hasValidData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Este es un ticket de ejemplo. Los datos mostrados son ficticios.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ticket */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-sky-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plane className="h-8 w-8" />
                <span className="text-2xl font-bold">AeroColombiana</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Código de Reserva</div>
                <div className="text-xl font-bold">{bookingReference}</div>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{flight?.departureTime}</div>
                <div className="text-gray-600">{flight?.origin}</div>
                <div className="text-sm text-gray-500">{flight?.departureDate}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <Plane className="h-6 w-6 mx-4 text-sky-500" />
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <div className="text-sm text-gray-600">{flight?.duration}</div>
                <div className="text-xs text-gray-500">Vuelo directo</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{flight?.arrivalTime}</div>
                <div className="text-gray-600">{flight?.destination}</div>
                <div className="text-sm text-gray-500">{flight?.departureDate}</div>
              </div>
            </div>

            {/* Passenger & Seat Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información del Pasajero
                </h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Nombre:</strong> {bookingData?.firstName} {bookingData?.lastName}</div>
                  <div><strong>Email:</strong> {bookingData?.email}</div>
                  <div><strong>Teléfono:</strong> {bookingData?.phone}</div>
                  <div><strong>Nacionalidad:</strong> {bookingData?.nationality}</div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Detalles del Asiento
                </h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Asiento:</strong> {selectedSeat}</div>
                  <div><strong>Clase:</strong> 
                    {(selectedSeat?.startsWith('1') || selectedSeat?.startsWith('2') || selectedSeat?.startsWith('3')) 
                      ? ' Premium' 
                      : selectedSeat?.startsWith('12') 
                      ? ' Salida de Emergencia' 
                      : ' Económica'
                    }
                  </div>
                  <div><strong>Aeronave:</strong> {flight?.aircraft}</div>
                </div>
              </div>
            </div>

            {/* Services */}
            {selectedServices && selectedServices.length > 0 && (
              <div className="border rounded-lg p-4 mb-8">
                <h3 className="font-semibold mb-3">Servicios Adicionales</h3>
                <div className="space-y-2">
                  {selectedServices.map((service: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{service.name}</span>
                      <span>{service.price === 0 ? 'Gratis' : `$${service.price.toLocaleString()} COP`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total Pagado:</span>
                <span className="text-2xl font-bold text-sky-500">
                  ${totalAmount?.toLocaleString()} COP
                </span>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Información Importante</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Presenta este ticket y tu documento de identidad en el aeropuerto</li>
                <li>• Llegada recomendada: 2 horas antes para vuelos nacionales</li>
                <li>• El check-in online estará disponible 24 horas antes del vuelo</li>
                <li>• Equipaje de mano: máximo 10kg</li>
              </ul>
            </div>

            {/* Download Status */}
            {downloadStatus !== 'idle' && (
              <div className={`mb-4 p-4 rounded-lg ${
                downloadStatus === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {downloadStatus === 'success' ? (
                    <>
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-green-700">¡Ticket descargado exitosamente!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-700">Error al descargar el ticket. Inténtalo de nuevo.</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex-1 py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  isDownloading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-sky-500 text-white hover:bg-sky-600'
                }`}
              >
                <Download className={`h-5 w-5 ${isDownloading ? 'animate-pulse' : ''}`} />
                <span>{isDownloading ? 'Descargando...' : 'Descargar Ticket'}</span>
              </button>
              <button
                onClick={handleNewBooking}
                className="flex-1 border border-sky-500 text-sky-500 py-3 px-6 rounded-lg hover:bg-sky-50 transition-colors"
              >
                Nueva Reserva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;