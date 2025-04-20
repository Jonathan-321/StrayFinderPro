# StrayFinderPro

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.0+-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, interactive web application that helps reunite lost pets with their owners through community reporting and searching.

## 🐾 Overview

StrayFinderPro is designed to address the common problem of lost pets in communities. The platform enables users to:

- Report stray or lost animals with precise location data
- Search for lost pets in their area
- Connect lost pets with their owners
- Help stray animals find new homes

## ✨ Features

- **Interactive Map**: Pinpoint exact locations using Leaflet map integration
- **Photo Upload**: Share images to help with identification
- **Search Functionality**: Find pets by location, breed, color, etc.
- **User Accounts**: Track your reports and get updates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Admin Dashboard**: Manage reports and user activity

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Radix UI components
- React Query for data fetching
- Leaflet for maps

### Backend
- Express.js with TypeScript
- Drizzle ORM for database operations
- JWT authentication
- Multer for file uploads

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jonathan-321/StrayFinderPro.git
   cd StrayFinderPro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the project root
   - See [ENVIRONMENT.md](ENVIRONMENT.md) for required variables

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to:
   ```
   http://localhost:3000
   ```

## 🔐 Environment Setup

This project uses environment variables for configuration. We've implemented a secure system to handle API keys and other sensitive information:

- Client-side variables are prefixed with `VITE_` 
- Server-side variables are accessed securely
- See [ENVIRONMENT.md](ENVIRONMENT.md) for detailed instructions

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📫 Contact

Jonathan Muhire - [GitHub Profile](https://github.com/Jonathan-321)

Project Link: [https://github.com/Jonathan-321/StrayFinderPro](https://github.com/Jonathan-321/StrayFinderPro) 