// Simple test to check backend connectivity
console.log('Testing backend connection...');

const testBackend = async () => {
  try {
    const response = await fetch('https://linkventory-production.up.railway.app/ping');
    const data = await response.json();
    console.log('Backend ping successful:', data);
  } catch (error) {
    console.error('Backend ping failed:', error);
  }
  
  try {
    const response = await fetch('https://linkventory-production.up.railway.app/health');
    const data = await response.json();
    console.log('Backend health check successful:', data);
  } catch (error) {
    console.error('Backend health check failed:', error);
  }
};

testBackend();
