import express from 'express';
import employeeSecureRoutes from './routes/employees-secure.js';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';
import { securityHeaders, rateLimitMiddleware, sanitizeInput, validateInputTypes } from './middleware/security.js';
import cors from 'cors';

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(rateLimitMiddleware(100, 15 * 60 * 1000)); // 100 requests per 15 minutes
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input validation and sanitization
app.use(sanitizeInput);
app.use(validateInputTypes);

// Authentication routes (public)
app.use('/api/auth', authRoutes);

// Protected routes - require authentication
app.use('/api/employees', authenticateToken, employeeSecureRoutes);

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error occurred:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

export default app;