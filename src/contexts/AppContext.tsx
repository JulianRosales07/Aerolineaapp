import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  aeronavesAPI,
  aeropuertosAPI,
  usuariosAPI
} from '../services/api';

interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline: string;
  aircraft: string;
  duration: string;
}

interface Aircraft {
  id: string;
  model: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  // Additional fields from API
  matricula?: string;
  compania?: string;
  certificadoAeronave?: string | null;
  manualOperacion?: string | null;
  nombreAeronave?: string;
  tipoAeronave?: string;
  claseServicio?: string;
  accesibilidadAeronave?: string;
  entretenimientoAeronave?: string;
  combustibleAeronave?: string;
  created_at?: string;
  relacionAeropuerto?: number | null;
}

interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  tipoAeropuerto?: string;
  estadoPistas?: string;
  balancePeso?: string;
  equipamientoEmergencia?: string;
  chequeoSistemas?: string;
  relacionRuta1?: number;
  relacionRuta2?: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
}

interface AppContextType {
  flights: Flight[];
  aircraft: Aircraft[];
  airports: Airport[];
  users: User[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  adminUser: string | null;
  currentBooking: any;
  setIsAdmin: (value: boolean) => void;
  setIsLoggedIn: (value: boolean) => void;
  setAdminUser: (user: string | null) => void;
  logout: () => void;
  setCurrentBooking: (booking: any) => void;
  addAircraft: (aircraft: Aircraft) => void;
  updateAircraft: (id: string, aircraft: Aircraft) => void;
  deleteAircraft: (id: string) => void;
  addAirport: (airport: Airport) => void;
  updateAirport: (id: string, airport: Airport) => void;
  deleteAirport: (id: string) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: User) => void;
  deleteUser: (id: string) => void;
  loadAircraftFromAPI: () => Promise<void>;
  loadAirportsFromAPI: () => Promise<void>;
  loadUsersFromAPI: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState(null);

  const logout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    setAdminUser(null);
  };

  const [flights] = useState<Flight[]>([
    {
      id: '1',
      origin: 'BOG',
      destination: 'MDE',
      departureDate: '2024-02-15',
      departureTime: '08:00',
      arrivalTime: '09:15',
      price: 180000,
      airline: 'AeroColombiana',
      aircraft: 'Boeing 737',
      duration: '1h 15m'
    },
    {
      id: '2',
      origin: 'MDE',
      destination: 'CTG',
      departureDate: '2024-02-16',
      departureTime: '14:30',
      arrivalTime: '15:45',
      price: 220000,
      airline: 'AeroColombiana',
      aircraft: 'Airbus A320',
      duration: '1h 15m'
    }
  ]);

  const [aircraft, setAircraft] = useState<Aircraft[]>([
    { id: '1', model: 'Boeing 737-800', capacity: 189, status: 'active' },
    { id: '2', model: 'Airbus A320', capacity: 180, status: 'active' },
    { id: '3', model: 'Boeing 787', capacity: 242, status: 'maintenance' }
  ]);

  const [airports, setAirports] = useState<Airport[]>([
    { id: '1', code: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colombia' },
    { id: '2', code: 'MDE', name: 'José María Córdova', city: 'Medellín', country: 'Colombia' },
    { id: '3', code: 'CTG', name: 'Rafael Núñez', city: 'Cartagena', country: 'Colombia' }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@email.com',
      phone: '+57 300 123 4567',
      nationality: 'Colombiana',
      dateOfBirth: '1990-05-15',
      gender: 'Masculino'
    }
  ]);

  const addAircraft = (newAircraft: Aircraft) => {
    const aircraftWithId = { 
      ...newAircraft, 
      id: newAircraft.id || Date.now().toString() 
    };
    setAircraft([...aircraft, aircraftWithId]);
  };

  const updateAircraft = (id: string, updatedAircraft: Aircraft) => {
    setAircraft(aircraft.map(a => a.id === id ? { ...updatedAircraft, id } : a));
  };

  const deleteAircraft = (id: string) => {
    setAircraft(aircraft.filter(a => a.id !== id));
  };

  const addAirport = (newAirport: Airport) => {
    setAirports([...airports, { ...newAirport, id: Date.now().toString() }]);
  };

  const updateAirport = (id: string, updatedAirport: Airport) => {
    setAirports(airports.map(a => a.id === id ? { ...updatedAirport, id } : a));
  };

  const deleteAirport = (id: string) => {
    setAirports(airports.filter(a => a.id !== id));
  };

  const addUser = (newUser: User) => {
    setUsers([...users, { ...newUser, id: Date.now().toString() }]);
  };

  const updateUser = (id: string, updatedUser: User) => {
    setUsers(users.map(u => u.id === id ? { ...updatedUser, id } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Funciones para cargar datos desde la API
  const loadAircraftFromAPI = useCallback(async () => {
    try {
      const data = await aeronavesAPI.getAll();
      console.log('Raw aircraft data from API:', data);

      // Transform data from Spanish API fields to English interface
      const transformedData = data.map((aircraft: any) => ({
        id: aircraft.idAeronave?.toString() || aircraft.id?.toString(),
        model: aircraft.modelo || aircraft.model,
        capacity: aircraft.capacidad || aircraft.capacity, // Use original field name
        status: aircraft.estado || aircraft.status || 'active',
        // Additional fields
        matricula: aircraft.matricula,
        compania: aircraft.compania,
        certificadoAeronave: aircraft.certificadoAeronave,
        manualOperacion: aircraft.manualOperacion,
        nombreAeronave: aircraft.nombreAeronave,
        tipoAeronave: aircraft.tipoAeronave,
        claseServicio: aircraft.claseServicio,
        accesibilidadAeronave: aircraft.accesibilidadAeronave,
        entretenimientoAeronave: aircraft.entretenimientoAeronave,
        combustibleAeronave: aircraft.combustibleAeronave,
        created_at: aircraft.created_at,
        relacionAeropuerto: aircraft.relacionAeropuerto
      }));

      console.log('Transformed aircraft data:', transformedData);
      setAircraft(transformedData);
    } catch (error) {
      console.error('Error loading aircraft:', error);
      // Keep existing data if API fails
    }
  }, []);

  const loadAirportsFromAPI = useCallback(async () => {
    try {
      const data = await aeropuertosAPI.getAll();
      console.log('Raw airport data from API:', data);

      // Transform data from Spanish API fields to English interface
      const transformedData = data.map((airport: any) => ({
        id: airport.idAeropuerto?.toString(),
        code: airport.codigo,
        name: airport.nombreAeropuerto,
        city: airport.ciudadAeropuerto,
        country: 'Colombia', // Default value since API doesn't have this field
        tipoAeropuerto: airport.tipoAeropuerto,
        estadoPistas: airport.estadoPistas,
        balancePeso: airport.balancePeso,
        equipamientoEmergencia: airport.equipamientoEmergencia,
        chequeoSistemas: airport.chequeoSistemas,
        relacionRuta1: airport.relacionRuta1,
        relacionRuta2: airport.relacionRuta2
      }));

      console.log('Transformed airport data:', transformedData);
      setAirports(transformedData);
    } catch (error) {
      console.error('Error loading airports:', error);
    }
  }, []);

  const loadUsersFromAPI = useCallback(async () => {
    console.log('AppContext: loadUsersFromAPI called');
    try {
      console.log('AppContext: Calling usuariosAPI.getAll()');
      const data = await usuariosAPI.getAll();
      console.log('AppContext: Raw user data from API:', data);

      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error('AppContext: API response is not an array:', data);
        throw new Error('API response is not an array');
      }

      // Transform data from Spanish API fields to English interface
      const transformedData = data.map((user: any) => {
        console.log('AppContext: Processing user:', user);
        // Split full name into first and last name
        const nameParts = (user.nombreUsuario || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const transformedUser = {
          id: user.idUsuario?.toString() || user.id?.toString(),
          firstName: firstName,
          lastName: lastName,
          email: user.correoUsuario || user.email || '',
          phone: user.celularUsuario || user.phone || '',
          nationality: user.paisUsuario || user.nationality || '',
          dateOfBirth: user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : '', // Format date to YYYY-MM-DD
          gender: user.rolUsuario || 'Cliente' // Using role as gender placeholder since gender is not in API
        };
        
        console.log('AppContext: Transformed user:', transformedUser);
        return transformedUser;
      });

      console.log('AppContext: All transformed user data:', transformedData);
      setUsers(transformedData);
      console.log('AppContext: Users state updated successfully');
    } catch (error) {
      console.error('AppContext: Error loading users:', error);
      throw error; // Re-throw to let the component handle the error
    }
  }, []);

  return (
    <AppContext.Provider value={{
      flights,
      aircraft,
      airports,
      users,
      isAdmin,
      isLoggedIn,
      adminUser,
      currentBooking,
      setIsAdmin,
      setIsLoggedIn,
      setAdminUser,
      logout,
      setCurrentBooking,
      addAircraft,
      updateAircraft,
      deleteAircraft,
      addAirport,
      updateAirport,
      deleteAirport,
      addUser,
      updateUser,
      deleteUser,
      loadAircraftFromAPI,
      loadAirportsFromAPI,
      loadUsersFromAPI
    }}>
      {children}
    </AppContext.Provider>
  );
};