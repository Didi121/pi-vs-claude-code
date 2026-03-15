import { Request, Response, NextFunction } from 'express';

export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' http: https:"
  );
  
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('server');
  
  next();
}

export function rateLimitMiddleware(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!requests.has(ip) || (requests.get(ip)?.resetTime || 0) < now) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const requestData = requests.get(ip)!;
      requestData.count++;
      
      if (requestData.count > maxRequests) {
        res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
        });
        return;
      }
    }
    
    next();
  };
}

export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.body && typeof req.body === 'object') {
      // Sanitize string inputs to prevent XSS
      const sanitizeString = (value: string): string => {
        return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      };
      
      const sanitizeObject = (obj: any): any => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeString(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
          }
        }
        return obj;
      };
      
      req.body = sanitizeObject(req.body);
    }
    
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
}

export function validateInputTypes(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    // Validate email format if present
    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }
    }
    
    // Validate phone format if present
    if (req.body.phone) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(req.body.phone)) {
        res.status(400).json({ error: 'Invalid phone format' });
        return;
      }
    }
    
    // Validate salary is a positive number if present
    if (req.body.salary !== undefined) {
      const salary = parseFloat(req.body.salary);
      if (isNaN(salary) || salary < 0) {
        res.status(400).json({ error: 'Invalid salary amount' });
        return;
      }
    }
  }
  
  next();
}