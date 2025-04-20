/**
 * Environment variable helper for client-side
 * 
 * This provides type-safe access to environment variables
 * and prevents accidental exposure of secrets in the client
 */

// Only environment variables prefixed with VITE_
// are exposed to the client-side code
export const env = {
  // API configuration
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  
  // Map configuration
  mapApiKey: import.meta.env.VITE_MAP_API_KEY,
  
  // Other public client environment variables
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Helper function to validate required env vars
  validateEnv: () => {
    const required = [
      'VITE_MAP_API_KEY',
    ];
    
    const missing = required.filter(key => !import.meta.env[key]);
    
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