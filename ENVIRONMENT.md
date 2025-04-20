# Environment Variables Setup

This document outlines how to set up environment variables for StrayFinderPro.

## Why Environment Variables?

Environment variables allow us to:
1. Keep sensitive information (API keys, secrets) out of the codebase
2. Configure the application differently across environments (development, testing, production)
3. Support different developer setups without requiring code changes

## Setting Up

1. Create a `.env.local` file in the project root (this file is in `.gitignore` and won't be committed)
2. Add your environment variables following this template:

```
# API Configuration
API_URL=http://localhost:3000/api

# Map Services
VITE_MAP_API_KEY=your_map_api_key_here

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password_here
DB_NAME=strayfinder

# Auth Configuration
JWT_SECRET=your_jwt_secret_here
```

## Client vs Server Variables

- **Client-side variables** must be prefixed with `VITE_` (e.g., `VITE_MAP_API_KEY`)
- **Server-side variables** don't need a prefix (e.g., `JWT_SECRET`)

## Security Notes

1. **NEVER** commit `.env.local` or any other file containing real API keys or secrets
2. Rotate secrets if they are accidentally committed
3. For production, use the platform's environment variable system (e.g., Heroku Config Vars, Vercel Environment Variables)

## Getting API Keys

- **Map API Key**: Sign up at [Mapbox](https://www.mapbox.com/) or [Google Maps Platform](https://cloud.google.com/maps-platform/) to get a map API key

## Debugging

If you encounter errors related to missing environment variables:
1. Check if all required variables are in your `.env.local` file
2. Make sure you're prefixing client-side variables with `VITE_`
3. Verify that the application is reading from the correct environment file 