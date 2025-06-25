// Test CORS preflight request
const testCORS = async () => {
  try {
    console.log('Testing CORS preflight (OPTIONS)...');
    
    const response = await fetch('https://linkventory-production.up.railway.app/signup', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://linkventory.pages.dev',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    
    console.log('OPTIONS Response status:', response.status);
    console.log('OPTIONS Response headers:', [...response.headers.entries()]);
    
  } catch (error) {
    console.error('OPTIONS request error:', error);
  }
};

testCORS();
