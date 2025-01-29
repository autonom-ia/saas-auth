const { authService } = require('../services/authService');
const { initializeDatabase } = require('../config/database');

let isInitialized = false;

const initialize = async () => {
  if (!isInitialized) {
    console.log('Initializing database...');
    const { User } = await initializeDatabase();
    await authService.setUser(User);
    isInitialized = true;
    console.log('Database initialized successfully');
  }
};

module.exports.login = async (event) => {
  try {
    await initialize();
    
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    const result = await authService.login(email, password);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
