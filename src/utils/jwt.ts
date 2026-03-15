import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  userId: string;
  username: string;
  role: 'admin' | 'manager' | 'employee' | 'hr';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export function generateTokens(payload: JWTPayload): AuthTokens {
  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'personnel-management-api',
  });
  
  const refreshToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d',
    issuer: 'personnel-management-api',
  });
  
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header');
  }
  return authHeader.substring(7);
}