// Test simple para verificar la API
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    const response = await fetch('http://localhost:4000/api/usuarios');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Test Error:', error);
    throw error;
  }
};

// Ejecutar test
testAPI();