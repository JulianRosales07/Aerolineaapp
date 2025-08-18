import React from 'react';
import { Phone, Mail, MapPin, Clock, Luggage, CreditCard, Shield, Users, FileText, AlertCircle } from 'lucide-react';

const Info: React.FC = () => {
  const contactInfo = [
    { icon: Phone, label: 'Teléfono', value: '+57 1 800-AERO (2376)', available: '24/7' },
    { icon: Mail, label: 'Email', value: 'info@NovaAir.com', available: 'Respuesta en 24h' },
    { icon: MapPin, label: 'Oficina Principal', value: 'Aeropuerto El Dorado, Bogotá', available: 'Lun-Dom 5:00-23:00' }
  ];

  const travelRequirements = [
    {
      title: 'Documentos de Identidad',
      icon: FileText,
      items: [
        'Cédula de ciudadanía vigente para vuelos nacionales',
        'Pasaporte vigente para vuelos internacionales',
        'Menores de edad: registro civil y autorización notarial si viajan solos'
      ]
    },
    {
      title: 'Equipaje',
      icon: Luggage,
      items: [
        'Equipaje de mano: máximo 10kg y dimensiones 55x40x25cm',
        'Equipaje facturado: incluido hasta 23kg en tarifa básica',
        'Líquidos en equipaje de mano: máximo 100ml por envase'
      ]
    },
    {
      title: 'Check-in',
      icon: Clock,
      items: [
        'Check-in online: desde 24 horas hasta 1 hora antes',
        'Check-in en mostrador: hasta 45 minutos antes (nacional)',
        'Llegada al aeropuerto: 2 horas antes (nacional), 3 horas (internacional)'
      ]
    }
  ];

  const services = [
    {
      title: 'Asistencia Especial',
      icon: Users,
      description: 'Servicios para personas con movilidad reducida, menores no acompañados y asistencia médica.',
      contact: 'Solicitar con 48h de anticipación'
    },
    {
      title: 'Cambios y Cancelaciones',
      icon: CreditCard,
      description: 'Flexibilidad para modificar tu viaje según el tipo de tarifa adquirida.',
      contact: 'Consulta condiciones tarifarias'
    },
    {
      title: 'Seguro de Viaje',
      icon: Shield,
      description: 'Protección adicional para tu viaje con cobertura médica y cancelación.',
      contact: 'Disponible al momento de la compra'
    }
  ];

  const faq = [
    {
      question: '¿Cuánto equipaje puedo llevar?',
      answer: 'En tarifa básica incluyes equipaje de mano (10kg) y equipaje facturado (23kg). Puedes adquirir equipaje adicional.'
    },
    {
      question: '¿Puedo cambiar mi vuelo?',
      answer: 'Sí, según el tipo de tarifa. Las tarifas flexibles permiten cambios sin costo, las básicas tienen tarifa de cambio.'
    },
    {
      question: '¿Qué pasa si llego tarde al aeropuerto?',
      answer: 'El check-in cierra 45 minutos antes del vuelo nacional. Si llegas tarde, puedes reprogramar tu vuelo según disponibilidad.'
    },
    {
      question: '¿Puedo seleccionar mi asiento?',
      answer: 'Sí, puedes seleccionar asiento gratuito en el check-in online o pagar por asientos preferenciales al reservar.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Información y Ayuda</h1>
          <p className="text-xl opacity-90">Todo lo que necesitas saber para tu viaje</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Contact Information */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{contact.label}</h3>
                <p className="text-gray-800 font-medium mb-1">{contact.value}</p>
                <p className="text-sm text-gray-600">{contact.available}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Requirements */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Requisitos para Viajar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {travelRequirements.map((req, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <req.icon className="h-6 w-6 text-sky-600 mr-3" />
                  <h3 className="text-xl font-semibold">{req.title}</h3>
                </div>
                <ul className="space-y-2">
                  {req.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Servicios Adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <service.icon className="h-6 w-6 text-sky-600 mr-3" />
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-sm text-sky-600 font-medium">
                  {service.contact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {faq.map((item, index) => (
              <div key={index} className="border-b last:border-b-0">
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-sky-600 mr-2" />
                    {item.question}
                  </h4>
                  <p className="text-gray-600 ml-7">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Info */}
        <section className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-800 mb-4">Información de Emergencia</h3>
            <p className="text-red-700 mb-4">
              En caso de emergencia durante el vuelo, sigue las instrucciones de la tripulación.
              Para emergencias en tierra, contacta inmediatamente:
            </p>
            <div className="bg-red-100 rounded-lg p-4 inline-block">
              <p className="text-red-800 font-semibold">
                📞 Línea de Emergencias: +57 1 800-HELP (4357)
              </p>
              <p className="text-sm text-red-600">Disponible 24/7</p>
            </div>
          </div>
        </section>

        {/* App Download */}
        <section className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¡Descarga nuestra App!</h3>
          <p className="mb-6 opacity-90">
            Gestiona tus reservas, haz check-in y recibe notificaciones en tiempo real
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              📱 Descargar para iOS
            </button>
            <button className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              📱 Descargar para Android
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Info;