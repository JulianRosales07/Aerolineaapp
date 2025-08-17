import React from 'react';
import { BarChart3, Users, Plane, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { flights, aircraft, airports, users } = useApp();

  const stats = [
    { title: 'Total Vuelos', value: flights.length, icon: Plane, color: 'bg-blue-500' },
    { title: 'Aeronaves Activas', value: aircraft.filter(a => a.status === 'active').length, icon: Plane, color: 'bg-green-500' },
    { title: 'Aeropuertos', value: airports.length, icon: MapPin, color: 'bg-purple-500' },
    { title: 'Usuarios', value: users.length, icon: Users, color: 'bg-yellow-500' },
  ];

  const recentBookings = [
    { id: 'AC123456', passenger: 'Juan Pérez', route: 'BOG → MDE', date: '2024-02-15', amount: '$180,000' },
    { id: 'AC123457', passenger: 'María González', route: 'MDE → CTG', date: '2024-02-16', amount: '$220,000' },
    { id: 'AC123458', passenger: 'Carlos Rodriguez', route: 'CTG → BOG', date: '2024-02-17', amount: '$200,000' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de la aerolínea</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ingresos Mensuales</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {[
              { month: 'Enero', amount: 45000000, percentage: 85 },
              { month: 'Febrero', amount: 52000000, percentage: 95 },
              { month: 'Marzo', amount: 38000000, percentage: 70 },
              { month: 'Abril', amount: 48000000, percentage: 88 },
            ].map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{data.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full" 
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">${data.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flight Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Estado de Vuelos</h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">A Tiempo</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm font-medium">95%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Retrasados</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                </div>
                <span className="text-sm font-medium">3%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cancelados</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                </div>
                <span className="text-sm font-medium">2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Reservas Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Código</th>
                <th className="text-left py-2">Pasajero</th>
                <th className="text-left py-2">Ruta</th>
                <th className="text-left py-2">Fecha</th>
                <th className="text-left py-2">Monto</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{booking.id}</td>
                  <td className="py-2">{booking.passenger}</td>
                  <td className="py-2">{booking.route}</td>
                  <td className="py-2">{booking.date}</td>
                  <td className="py-2 text-green-600 font-medium">{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;