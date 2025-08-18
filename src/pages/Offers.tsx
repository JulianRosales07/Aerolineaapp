import React from 'react';
import { MapPin, Calendar, Star } from 'lucide-react';

const Offers: React.FC = () => {
  const featuredOffers = [
    {
      id: 1,
      destination: 'Cartagena',
      code: 'CTG',
      price: 180000,
      originalPrice: 250000,
      discount: 28,
      image: 'https://media.staticontent.com/media/pictures/9495889e-54f9-40d2-939d-b04bf30b47c7',
      description: 'Descubre la ciudad amurallada y sus playas paradisíacas',
      validUntil: '2024-03-15',
      features: ['Vuelo directo', 'Equipaje incluido', 'Snack gratis']
    },
    {
      id: 2,
      destination: 'Medellín',
      code: 'MDE',
      price: 150000,
      originalPrice: 200000,
      discount: 25,
      image: 'https://www.ciencuadras.com/blog/wp-content/uploads/2023/06/Medellin-barrios-principales-historia-inmuebles.jpg',
      description: 'La ciudad de la eterna primavera te espera',
      validUntil: '2024-03-20',
      features: ['Check-in gratis', 'Cambios flexibles', 'Wi-Fi gratis']
    },
    {
      id: 3,
      destination: 'San Andrés',
      code: 'SAI',
      price: 320000,
      originalPrice: 450000,
      discount: 29,
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/88/76/decameron-aquarium.jpg?w=600&h=400&s=1',
      description: 'El paraíso del Caribe colombiano',
      validUntil: '2024-04-01',
      features: ['Mar de 7 colores', 'Actividades incluidas', 'Resort partners']
    }
  ];

  const popularDestinations = [
    { city: 'Cali', code: 'CLO', price: 170000, image: 'https://i.ytimg.com/vi/41S-dcc-90Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDT3GgNL7Op2Zd2dCx03iAVUH6Q-A' },
    { city: 'Barranquilla', code: 'BAQ', price: 195000, image: 'https://colombiaone.com/wp-content/uploads/2023/08/Window_World_Monument_Barranquilla_credit_PrimeroBarranquilla_-Facebook.jpg' },
    { city: 'Santa Marta', code: 'SMR', price: 210000, image: 'https://www.ciencuadras.com/blog/wp-content/uploads/2023/01/760x501_Santa-Marta.jpg' },
    { city: 'Pereira', code: 'PEI', price: 140000, image: 'https://www.elespectador.com/resizer/v2/2QCUCOLNWBEFVJ5Z6V4NBQKFH4.jpg?auth=3d21aea7cc28727527dc950736e09b1e7c5e224e95888f6ef7c4b45a3d761986&width=920&height=613&smart=true&quality=60' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Ofertas y Destinos Especiales</h1>
          <p className="text-xl opacity-90">Descubre increíbles destinos a precios únicos</p>
        </div>
      </div>

      {/* Featured Offers */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Ofertas Destacadas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative">
                <img 
                  src={offer.image} 
                  alt={offer.destination}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{offer.discount}%
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{offer.destination}</h3>
                  <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-sm font-semibold">
                    {offer.code}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{offer.description}</p>
                
                <div className="space-y-2 mb-4">
                  {offer.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-sky-600">
                        ${offer.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${offer.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">COP por persona</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Válido hasta {offer.validUntil}
                  </div>
                  <button className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Destinations */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Destinos Populares</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={destination.image} 
                  alt={destination.city}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{destination.city}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {destination.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Desde</span>
                    <span className="font-bold text-sky-600">
                      ${destination.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-8 mt-16 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¡No te pierdas nuestras ofertas!</h3>
          <p className="mb-6 opacity-90">Suscríbete a nuestro boletín y recibe las mejores ofertas directamente en tu correo</p>
          <div className="max-w-md mx-auto flex space-x-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-sky-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;