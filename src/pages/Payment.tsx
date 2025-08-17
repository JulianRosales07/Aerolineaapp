import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Lock, Check } from 'lucide-react';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengers, bookingData, selectedServices, selectedSeat } = location.state || {};

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => {
    const flightPrice = flight?.price || 0;
    const servicesPrice = selectedServices?.reduce((total: number, service: any) => total + (service?.price || 0), 0) || 0;
    const seatPrice = (selectedSeat?.startsWith('1') || selectedSeat?.startsWith('2') || selectedSeat?.startsWith('3')) ? 50000 : 0;
    
    return flightPrice + servicesPrice + seatPrice;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    
    // Generate booking reference
    const bookingReference = `AC${Date.now().toString().slice(-6)}`;
    
    navigate('/ticket', {
      state: {
        bookingReference,
        flight,
        passengers,
        bookingData,
        selectedServices,
        selectedSeat,
        totalAmount: calculateTotal()
      }
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData({ ...paymentData, cardNumber: formatted });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Realizar Pago</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <Lock className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Transacción segura con encriptación SSL</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="h-4 w-4 inline mr-1" />
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre en la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                    placeholder="JUAN CARLOS PEREZ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-8 bg-sky-500 text-white py-4 px-6 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando pago...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Pagar ${calculateTotal().toLocaleString()} COP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Resumen de Compra</h3>
              
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <h4 className="font-semibold mb-2">Detalles del Vuelo</h4>
                  <p className="text-sm text-gray-600">{flight?.origin} → {flight?.destination}</p>
                  <p className="text-sm text-gray-600">{flight?.departureDate} - {flight?.departureTime}</p>
                  <p className="text-sm text-gray-600">Asiento: {selectedSeat}</p>
                </div>

                <div className="pb-4 border-b">
                  <h4 className="font-semibold mb-2">Pasajero</h4>
                  <p className="text-sm text-gray-600">{bookingData?.firstName} {bookingData?.lastName}</p>
                  <p className="text-sm text-gray-600">{bookingData?.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vuelo base:</span>
                    <span>${(flight?.price || 0).toLocaleString()} COP</span>
                  </div>
                  
                  {selectedServices && selectedServices.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Servicios:</div>
                      {selectedServices.map((service: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{service?.name || 'Servicio'}:</span>
                          <span>${(service?.price || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(selectedSeat?.startsWith('1') || selectedSeat?.startsWith('2') || selectedSeat?.startsWith('3')) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Asiento Premium:</span>
                      <span>$50,000</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-sky-500">${calculateTotal().toLocaleString()} COP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;