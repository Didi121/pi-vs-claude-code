import { Request, Response } from 'express';
import { userStore } from '../models/user.js';
import { generateTokens } from '../utils/jwt.js';
import { JWTPayload } from '../utils/jwt.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }
    
    // Check if user already exists
    const existingUserByUsername = userStore.findByUsername(username);
    if (existingUserByUsername) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }
    
    const existingUserByEmail = userStore.findByEmail(email);
    if (existingUserByEmail) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    
    // Validate role
    const validRoles = ['admin', 'manager', 'employee', 'hr'];
    const userRole = role || 'employee';
    if (!validRoles.includes(userRole)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }
    
    // Create user
    const newUser = await userStore.create({
      username,
      email,
      password,
      role: userRole as any,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Generate tokens
    const payload: JWTPayload = {
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };
    
    const tokens = generateTokens(payload);
    
    // Return user data without password
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      tokens,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }
    
    // Find user
    const user = userStore.findByUsername(username);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({ error: 'Account is deactivated' });
      return;
    }
    
    // Verify password
    const isPasswordValid = await userStore.comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
    
    const tokens = generateTokens(payload);
    
    // Return user data without password
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    
    res.json({
      message: 'Login successful',
      user: userResponse,
      tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }
    
    // For this implementation, we'll use the same secret for both tokens
    // In production, you might want separate secrets for access and refresh tokens
    const payload: JWTPayload = require('../utils/jwt.js').verifyToken(refreshToken);
    
    // Check if user still exists and is active
    const user = userStore.findById(payload.userId);
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }
    
    // Generate new tokens
    const newPayload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
    
    const tokens = generateTokens(newPayload);
    
    res.json({
      message: 'Token refreshed successfully',
      tokens,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const getProfile = (req: Request, res: Response) => {
  const { user } = req as any; // AuthRequest
  
  if (!user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  
  const userData = userStore.findById(user.userId);
  if (!userData) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  
  // Return user data without password
  const userResponse = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    role: userData.role,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
  
  res.json({ user: userResponse });
};