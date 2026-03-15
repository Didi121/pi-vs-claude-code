import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Authentication enabled with JWT tokens`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});