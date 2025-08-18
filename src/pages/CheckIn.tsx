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

    // Interpretar el valor ingresado como ID numérico del tiquete
    const id = parseInt(checkInData.bookingReference, 10);
    if (isNaN(id)) {
      alert('Ingresa un ID numérico de tiquete. Ej: 1');
      return;
    }

    try {
      // Buscar tiquete por ID en la API
      const res = await fetch(`http://localhost:4000/api/tiquetes/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          alert('Tiquete no encontrado');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const ticket = await res.json();
      console.info('ticket raw from API:', ticket);

      // helper para intentar traer JSON sin romper el flujo
      const tryFetchJson = async (url: string) => {
        try {
          const r = await fetch(url);
          if (r.ok) return await r.json();
        } catch (err) {
          console.warn('fetch failed', url, err);
        }
        return null;
      };

      // detectar ids según tu esquema
      const idPasajero = ticket.idPasajero ?? ticket.relacionUsuario ?? ticket.idUsuario ?? ticket.pasajeroId ?? null;
      const idVuelo = ticket.idVuelo ?? ticket.idVuelo ?? ticket.relacionVuelo ?? null;

      // intentar obtener nombre de pasajero si no viene en el ticket
      let passengerName = ticket.passengerName ?? ticket.nombrePasajero ?? ticket.nombre ?? null;
      if (!passengerName && idPasajero) {
        const usuario = await tryFetchJson(`http://localhost:4000/api/usuarios/${idPasajero}`);
        passengerName = usuario?.nombre ?? usuario?.fullName ?? usuario?.name ?? passengerName;
      }

      // intentar obtener datos del vuelo si no vienen en el ticket
      let flightNumber = ticket.flightNumber ?? ticket.flight ?? ticket.codigoVuelo ?? null;
      let origin = ticket.origin ?? ticket.origen ?? null;
      let destination = ticket.destination ?? ticket.destino ?? null;
      let date = ticket.date ?? ticket.fecha ?? null;
      let departureTime = ticket.departureTime ?? ticket.time ?? ticket.horaSalida ?? null;
      if (idVuelo && (!flightNumber || !origin || !destination)) {
        const vuelo = await tryFetchJson(`http://localhost:4000/api/vuelos/${idVuelo}`);
        flightNumber = flightNumber ?? vuelo?.numeroVuelo ?? vuelo?.flightNumber ?? vuelo?.codigo ?? null;
        origin = origin ?? vuelo?.origen ?? vuelo?.origin ?? null;
        destination = destination ?? vuelo?.destino ?? vuelo?.destination ?? null;
        date = date ?? vuelo?.fecha ?? vuelo?.date ?? null;
        departureTime = departureTime ?? vuelo?.salida ?? vuelo?.departureTime ?? null;
      }

      const flightFromTicket = {
        bookingReference: ticket.idTiquete ?? ticket.id ?? ticket.bookingReference ?? String(id),
        passenger: passengerName ?? `${checkInData.lastName}, (sin nombre)`,
        flight: flightNumber ?? 'AC1234',
        origin: origin ?? 'BOG - Bogotá',
        destination: destination ?? 'MDE - Medellín',
        date: date ?? '2024-02-15',
        departureTime: departureTime ?? '08:00',
        gate: ticket.gate ?? ticket.puerta ?? 'A12',
        seat: ticket.idAsiento ?? ticket.seat ?? '12F',
        boardingTime: ticket.boardingTime ?? ticket.horaEmbarque ?? '07:30',
        // incluir ticket crudo para inspección / mostrar campos DB
        rawTicket: ticket
      };

      // Registrar el check-in (no bloquear la UI si falla)
      const checkinDataToCreate = {
        bookingReference: String(flightFromTicket.bookingReference),
        lastName: checkInData.lastName,
        checkinTime: new Date().toISOString(),
        status: 'completed',
        tiqueteId: ticket.idTiquete ?? ticket.id ?? null
      };
      try {
        await checkinAPI.create(checkinDataToCreate);
      } catch (err) {
        console.warn('checkinAPI.create failed, continuing to show ticket', err);
      }

      setFlightInfo(flightFromTicket);
      setCheckedIn(true);
    } catch (error) {
      console.error('Error fetching tiquete:', error);
      alert('Error al buscar el tiquete. Revisa la consola del desarrollador.');
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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Check-in Online</h1>
            <p className="text-xl opacity-90">Ahorra tiempo y haz tu check-in desde casa</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">¡Check-in Completado!</h1>
              <p className="text-gray-600">Tu pase de abordar está listo</p>
            </div>

            {/* Botón Salir - vuelve a la página Home */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="text-sm px-3 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Salir
              </button>
            </div>
  
            {/* Boarding Pass */}
            <div className="bg-sky-50 rounded-xl shadow-inner overflow-hidden mb-8">
              <div className="bg-sky-500 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-8 w-8" />
                    <span className="text-2xl font-bold">NovaAir</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Vuelo</div>
                    <div className="text-xl font-bold">{flightInfo.flight}</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Sección pasajero / reserva / asiento */}
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

                {/* Sección origen / destino / fecha / salida */}
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

                {/* Datos crudos del tiquete */}
                {flightInfo?.rawTicket && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-700">
                    <div>
                      <div className="text-gray-500">idTiquete</div>
                      <div className="font-medium">{flightInfo.rawTicket.idTiquete ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">created_at</div>
                      <div className="font-medium">{flightInfo.rawTicket.created_at ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">idVuelo</div>
                      <div className="font-medium">{flightInfo.rawTicket.idVuelo ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">idPasajero</div>
                      <div className="font-medium">{flightInfo.rawTicket.idPasajero ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">idAsiento</div>
                      <div className="font-medium">{flightInfo.rawTicket.idAsiento ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">fechaCompra</div>
                      <div className="font-medium">{flightInfo.rawTicket.fechaCompra ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">equipaje</div>
                      <div className="font-medium">{flightInfo.rawTicket.equipaje ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">claseVuelo</div>
                      <div className="font-medium">{flightInfo.rawTicket.claseVuelo ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">relacionAeronave</div>
                      <div className="font-medium">{flightInfo.rawTicket.relacionAeronave ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">relacionUsuario</div>
                      <div className="font-medium">{flightInfo.rawTicket.relacionUsuario ?? '-'}</div>
                    </div>
                  </div>
                )}

                {/* Sección de embarque */}
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

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button className="flex-1 bg-sky-500 text-white py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors font-semibold">
                    Descargar PDF
                  </button>
                  <button className="flex-1 border border-sky-500 text-sky-500 py-3 px-6 rounded-lg hover:bg-sky-50 transition-colors font-semibold">
                    Enviar por Email
                  </button>
                </div>
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
                    onChange={(e) => setCheckInData({ ...checkInData, bookingReference: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="1"
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

              {/* Check-in Steps */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Pasos para el Check-in</h3>
                <div className="space-y-4">
                  {checkInSteps.map((step) => (
                    <div key={step.step} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white">
                          {step.step}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-800">{step.title}</p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-in Tips */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Consejos para el Check-in</h3>
                <div className="space-y-4">
                  {checkInTips.map((tip, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
                          <tip.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-800">{tip.title}</p>
                        <p className="text-sm text-gray-500">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block">
            <div className="relative">
              <img src="https://img.freepik.com/free-vector/airport-concept-illustration-woman-airport-check-terminal_24908-61083.jpg" alt="Check-in Illustration" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;