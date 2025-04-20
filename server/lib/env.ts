/**
 * Environment variable helper for server-side
 * 
 * This provides type-safe access to environment variables
 * and validates that required variables are present
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

// Environment variable access with defaults and types
export const env = {
  // Server configuration
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'strayfinder',
  
  // Authentication
  jwtSecret: process.env.JWT_SECRET || '',
  
  // Validate required environment variables
  validateEnv: () => {
    const required = [
      'JWT_SECRET',
      'DB_PASSWORD',
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file or environment configuration.'
      );
      return false;
    }
    
    return true;
  }
}; 