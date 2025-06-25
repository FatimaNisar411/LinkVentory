// Test signup endpoint to debug CORS and server issues
const testSignup = async () => {
  try {
    console.log('Testing signup endpoint...');
    
    const response = await fetch('https://linkventory-production.up.railway.app/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`, // Use unique email
        password: 'testpass123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success data:', data);
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

testSignup();
