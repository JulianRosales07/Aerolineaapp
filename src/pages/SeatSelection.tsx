import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SeatSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengers, bookingData, selectedServices } = location.state || {};

  const [selectedSeat, setSelectedSeat] = useState<string>('');

  // Generate seat map (simplified)
  const generateSeatMap = () => {
    const rows = 20;
    const seatsPerRow = ['A', 'B', 'C', 'D', 'E', 'F'];
    const occupiedSeats = ['1A', '1B', '3C', '5F', '8A', '12D']; // Mock occupied seats
    
    const seatMap = [];
    for (let row = 1; row <= rows; row++) {
      const rowSeats = seatsPerRow.map(letter => ({
        id: `${row}${letter}`,
        row,
        letter,
        isOccupied: occupiedSeats.includes(`${row}${letter}`),
        isPremium: row <= 3,
        isEmergencyExit: row === 12
      }));
      seatMap.push(rowSeats);
    }
    return seatMap;
  };

  const seatMap = generateSeatMap();

  const getSeatClass = (seat: any) => {
    if (seat.isOccupied) return 'bg-gray-300 cursor-not-allowed';
    if (selectedSeat === seat.id) return 'bg-sky-500 text-white';
    if (seat.isPremium) return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';
    if (seat.isEmergencyExit) return 'bg-green-100 border-green-300 hover:bg-green-200';
    return 'bg-white border-gray-300 hover:bg-gray-100';
  };

  const handleSeatSelect = (seatId: string, isOccupied: boolean) => {
    if (!isOccupied) {
      setSelectedSeat(seatId);
    }
  };

  const handleContinue = () => {
    if (selectedSeat) {
      navigate('/payment', {
        state: {
          flight,
          passengers,
          bookingData,
          selectedServices,
          selectedSeat
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Selecciona tu Asiento</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Mapa del Avión</h2>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 mr-2"></div>
                    <span>Premium (+$50,000)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 mr-2"></div>
                    <span>Salida de emergencia</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                    <span>Ocupado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-sky-500 mr-2"></div>
                    <span>Seleccionado</span>
                  </div>
                </div>
              </div>

              {/* Airplane front */}
              <div className="text-center mb-4">
                <div className="inline-block bg-gray-200 px-4 py-2 rounded-t-full text-sm font-medium">
                  CABINA
                </div>
              </div>

              {/* Seat map */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {seatMap.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center items-center space-x-1">
                    <span className="w-8 text-center text-sm font-medium text-gray-500">
                      {row[0].row}
                    </span>
                    
                    {/* Left side seats (A, B, C) */}
                    {row.slice(0, 3).map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatSelect(seat.id, seat.isOccupied)}
                        disabled={seat.isOccupied}
                        className={`w-8 h-8 text-xs font-medium border rounded ${getSeatClass(seat)} transition-colors`}
                      >
                        {seat.letter}
                      </button>
                    ))}
                    
                    {/* Aisle */}
                    <div className="w-6"></div>
                    
                    {/* Right side seats (D, E, F) */}
                    {row.slice(3, 6).map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatSelect(seat.id, seat.isOccupied)}
                        disabled={seat.isOccupied}
                        className={`w-8 h-8 text-xs font-medium border rounded ${getSeatClass(seat)} transition-colors`}
                      >
                        {seat.letter}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleContinue}
                disabled={!selectedSeat}
                className="w-full bg-sky-500 text-white py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-300"
              >
                Continuar al Pago
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Asiento Seleccionado</h3>
              
              {selectedSeat ? (
                <div className="mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sky-500 mb-2">
                      {selectedSeat}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedSeat.startsWith('1') || selectedSeat.startsWith('2') || selectedSeat.startsWith('3') 
                        ? 'Asiento Premium' 
                        : selectedSeat.startsWith('12') 
                        ? 'Salida de Emergencia' 
                        : 'Asiento Estándar'
                      }
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 text-center text-gray-500">
                  Selecciona un asiento del mapa
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vuelo:</span>
                  <span>{flight?.origin} → {flight?.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pasajero:</span>
                  <span>{bookingData?.firstName} {bookingData?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span>{flight?.departureTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;