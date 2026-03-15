import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    const user = verifyToken(token);
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Access denied. Invalid or missing authentication token.',
      details: error instanceof Error ? error.message : 'Unknown authentication error'
    });
  }
}

export function requireRole(role: string | string[]) {
  const allowedRoles = Array.isArray(role) ? role : [role];
  
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole
      });
      return;
    }
    
    next();
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  requireRole('admin')(req, res, next);
}

export function requireHR(req: AuthRequest, res: Response, next: NextFunction): void {
  requireRole(['hr', 'admin'])(req, res, next);
}

export function requireManager(req: AuthRequest, res: Response, next: NextFunction): void {
  requireRole(['manager', 'hr', 'admin'])(req, res, next);
}