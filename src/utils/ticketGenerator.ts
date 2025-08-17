// Removed unused import

export interface TicketData {
  bookingReference: string;
  flight: any;
  passengerDetails: any[];
  selectedSeat: string;
  selectedServices: any[];
  totalAmount: number;
}

export const generateTicketPDF = (ticketData: TicketData) => {
  const {
    bookingReference,
    flight,
    passengerDetails,
    selectedSeat,
    selectedServices,
    totalAmount
  } = ticketData;

  // Crear contenido HTML para el ticket
  const ticketHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Ticket - ${bookingReference}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .ticket {
          background: white;
          max-width: 800px;
          margin: 0 auto;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          color: white;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .booking-ref {
          text-align: right;
        }
        .booking-ref-label {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        .booking-ref-code {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .content {
          padding: 30px;
        }
        .flight-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .airport {
          text-align: center;
          flex: 1;
        }
        .airport-code {
          font-size: 32px;
          font-weight: bold;
          color: #0ea5e9;
        }
        .airport-name {
          color: #64748b;
          margin-top: 5px;
        }
        .flight-path {
          flex: 1;
          text-align: center;
          position: relative;
        }
        .flight-line {
          height: 2px;
          background: #cbd5e1;
          margin: 20px 0;
          position: relative;
        }
        .plane-icon {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 5px;
          border-radius: 50%;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        .detail-section {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
        }
        .detail-title {
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .detail-label {
          color: #64748b;
        }
        .detail-value {
          font-weight: 500;
          color: #1e293b;
        }
        .services {
          margin-top: 20px;
        }
        .service-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .total {
          background: #0ea5e9;
          color: white;
          padding: 20px;
          text-align: center;
          margin-top: 30px;
          border-radius: 8px;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
        }
        .important-info {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
        }
        .important-title {
          font-weight: bold;
          color: #92400e;
          margin-bottom: 10px;
        }
        .important-list {
          color: #92400e;
          font-size: 14px;
          line-height: 1.6;
        }
        .qr-section {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .date-time {
          font-size: 18px;
          color: #64748b;
          margin-top: 5px;
        }
        .flight-number {
          background: #f1f5f9;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          color: #475569;
          margin: 10px 0;
        }
        @media print {
          body { 
            background: white; 
            margin: 0;
            padding: 0;
          }
          .ticket { 
            box-shadow: none; 
            margin: 0;
            max-width: none;
          }
          .header {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <div class="logo">
            <span style="font-size: 32px;">✈️</span>
            <span>AeroColombiana</span>
          </div>
          <div class="booking-ref">
            <div class="booking-ref-label">Código de Reserva</div>
            <div class="booking-ref-code">${bookingReference}</div>
          </div>
        </div>
        
        <div class="content">
          <div class="flight-info">
            <div class="airport">
              <div class="airport-code">${flight?.origen || flight?.origin || 'BOG'}</div>
              <div class="airport-name">Origen</div>
              <div class="date-time">${flight?.fecha_salida ? 
                new Date(flight.fecha_salida).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 
                flight?.departureTime || '08:00'
              }</div>
              <div style="font-size: 14px; color: #64748b; margin-top: 5px;">${flight?.fecha_salida ? 
                new Date(flight.fecha_salida).toLocaleDateString('es-CO') : 
                flight?.departureDate || '2024-02-15'
              }</div>
            </div>
            
            <div class="flight-path">
              <div class="flight-number">Vuelo AC-${Math.floor(Math.random() * 9000) + 1000}</div>
              <div class="flight-line">
                <div class="plane-icon">✈️</div>
              </div>
              <div style="color: #64748b; font-size: 14px; margin-top: 10px;">${flight?.duration || '1h 15m'}</div>
              <div style="color: #64748b; font-size: 12px;">Vuelo directo</div>
            </div>
            
            <div class="airport">
              <div class="airport-code">${flight?.destino || flight?.destination || 'MDE'}</div>
              <div class="airport-name">Destino</div>
              <div class="date-time">${flight?.fecha_regreso ? 
                new Date(flight.fecha_regreso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 
                flight?.arrivalTime || '09:15'
              }</div>
              <div style="font-size: 14px; color: #64748b; margin-top: 5px;">${flight?.fecha_salida ? 
                new Date(flight.fecha_salida).toLocaleDateString('es-CO') : 
                flight?.departureDate || '2024-02-15'
              }</div>
            </div>
          </div>
          
          <div class="details-grid">
            <div class="detail-section">
              <div class="detail-title">👤 Información del Pasajero</div>
              <div class="detail-item">
                <span class="detail-label">Nombre:</span>
                <span class="detail-value">${passengerDetails?.[0]?.firstName || 'Juan'} ${passengerDetails?.[0]?.lastName || 'Pérez'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${passengerDetails?.[0]?.email || 'juan@email.com'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Teléfono:</span>
                <span class="detail-value">${passengerDetails?.[0]?.phone || '+57 300 123 4567'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Nacionalidad:</span>
                <span class="detail-value">${passengerDetails?.[0]?.nationality || 'Colombiana'}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">🎫 Detalles del Vuelo</div>
              <div class="detail-item">
                <span class="detail-label">Fecha:</span>
                <span class="detail-value">${flight?.fecha_salida ? 
                  new Date(flight.fecha_salida).toLocaleDateString('es-CO') : 
                  flight?.departureDate || '2024-02-15'
                }</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Asiento:</span>
                <span class="detail-value">${selectedSeat || '12F'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Clase:</span>
                <span class="detail-value">${getSeatClass(selectedSeat)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Aeronave:</span>
                <span class="detail-value">${flight?.aircraft || 'Boeing 737'}</span>
              </div>
            </div>
          </div>
          
          ${selectedServices && selectedServices.length > 0 ? `
            <div class="detail-section services">
              <div class="detail-title">🎯 Servicios Adicionales</div>
              ${selectedServices.map(service => `
                <div class="service-item">
                  <span>${service.name}</span>
                  <span>${service.price === 0 ? 'Gratis' : `$${service.price.toLocaleString()} COP`}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="total">
            <div>Total Pagado</div>
            <div class="total-amount">$${totalAmount?.toLocaleString() || '180,000'} COP</div>
          </div>
          
          <div class="important-info">
            <div class="important-title">📋 Información Importante</div>
            <div class="important-list">
              • Presenta este ticket y tu documento de identidad en el aeropuerto<br>
              • Llegada recomendada: 2 horas antes para vuelos nacionales<br>
              • El check-in online estará disponible 24 horas antes del vuelo<br>
              • Equipaje de mano: máximo 10kg y dimensiones 55x40x25cm<br>
              • Conserva este ticket hasta completar tu viaje
            </div>
          </div>
          
          <div class="qr-section">
            <div style="font-weight: bold; margin-bottom: 10px;">Código QR del Ticket</div>
            <div style="font-size: 48px;">⬜⬛⬜⬛⬜⬛⬜</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 10px;">
              Escanea este código en el aeropuerto
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Crear y descargar el archivo HTML
  const blob = new Blob([ticketHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `AeroColombiana-Ticket-${bookingReference}.html`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // También abrir en nueva ventana para imprimir como PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    
    // Esperar a que se cargue y luego mostrar diálogo de impresión
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
};

const getSeatClass = (seat: string) => {
  if (!seat) return 'Económica';
  if (seat.startsWith('1') || seat.startsWith('2') || seat.startsWith('3')) {
    return 'Premium';
  }
  if (seat.startsWith('12')) {
    return 'Salida de Emergencia';
  }
  return 'Económica';
};