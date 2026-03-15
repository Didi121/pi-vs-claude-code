import { expect, describe, it, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { userStore } from '../models/user.js';

describe('Authentication & Authorization Tests', () => {
  let authToken: string;
  let userId: string;
  
  beforeEach(async () => {
    // Create a test user
    const user = await userStore.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'hr',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    userId = user.id;
    
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    
    authToken = loginResponse.body.tokens.accessToken;
  });
  
  afterEach(() => {
    // Clean up test data
    if (userId) {
      userStore.delete(userId);
    }
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'employee',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.user.username).toBe('newuser');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user.role).toBe('employee');
    });
    
    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'incompleteuser',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should fail with duplicate username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser', // Already exists
          email: 'another@example.com',
          password: 'password123',
        });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toContain('already exists');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });
    
    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
    
    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });
  });
  
  describe('Protected Employee Routes', () => {
    it('should access employee list with valid token', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
    });
    
    it('should fail to access employee list without token', async () => {
      const response = await request(app)
        .get('/api/employees');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Access denied');
    });
    
    it('should fail to access employee list with invalid token', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Access denied');
    });
  });
  
  describe('Role-based Authorization', () => {
    it('should allow HR role to create employees', async () => {
      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer',
          department: 'IT',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
    });
    
    it('should allow employee role to view limited data', async () => {
      // Create employee role user
      const employeeUser = await userStore.create({
        username: 'employeeuser',
        email: 'employee@example.com',
        password: 'password123',
        role: 'employee',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const employeeLogin = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'employeeuser',
          password: 'password123',
        });
      
      const employeeToken = employeeLogin.body.tokens.accessToken;
      
      // Test viewing employee data
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${employeeToken}`);
      
      expect(response.status).toBe(200);
      // Employee role should not see sensitive data like salary
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).not.toHaveProperty('salary');
      }
      
      // Clean up
      userStore.delete(employeeUser.id);
    });
  });
  
  describe('Input Validation & Security', () => {
    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'bademail',
          email: 'invalid-email',
          password: 'password123',
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid email format');
    });
    
    it('should sanitize XSS attempts in input', async () => {
      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Test<script>alert("xss")</script>Name',
          lastName: 'SafeName',
          email: 'test@example.com',
          position: 'Developer',
          department: 'IT',
        });
      
      // Debug information
      if (response.status !== 201) {
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
      }
      
      expect(response.status).toBe(201);
      // The script tag should be stripped
      expect(response.body.data.firstName).not.toContain('<script>');
      expect(response.body.data.firstName).toBe('TestName'); // Should be stripped but have remaining text
    });
  });
  
  describe('Health Check & Security Headers', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
    });
    
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers).not.toHaveProperty('x-powered-by');
    });
  });
});