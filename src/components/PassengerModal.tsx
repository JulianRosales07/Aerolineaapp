import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (passengers: any) => void;
  initialPassengers?: any;
}

const PassengerModal: React.FC<PassengerModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialPassengers = { adults: 1, youth: 0, children: 0, infants: 0 }
}) => {
  const [passengers, setPassengers] = useState(initialPassengers);

  if (!isOpen) return null;

  const updatePassenger = (type: string, change: number) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change)
    }));
  };

  const handleConfirm = () => {
    onConfirm(passengers);
    onClose();
  };

  const total = passengers.adults + passengers.youth + passengers.children + passengers.infants;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Seleccionar Pasajeros</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { key: 'adults', label: 'Adultos', desc: '12+ años' },
            { key: 'youth', label: 'Jóvenes', desc: '12-17 años' },
            { key: 'children', label: 'Niños', desc: '2-11 años' },
            { key: 'infants', label: 'Bebés', desc: '0-2 años' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updatePassenger(key, -1)}
                  className="p-1 rounded-full border hover:bg-gray-100"
                  disabled={passengers[key] === 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{passengers[key]}</span>
                <button
                  onClick={() => updatePassenger(key, 1)}
                  className="p-1 rounded-full border hover:bg-gray-100"
                  disabled={total >= 9}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Total: {total} pasajeros
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              disabled={total === 0}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerModal;