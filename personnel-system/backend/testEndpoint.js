const axios = require('axios');

async function testCreateEmployee() {
  try {
    const response = await axios.post('http://localhost:3001/api/employees', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      hireDate: '2026-03-15'
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCreateEmployee();