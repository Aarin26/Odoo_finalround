# GlobeTrotter - AI-Powered Travel Planning Application

GlobeTrotter is a full-stack web application that helps users plan personalized travel itineraries with AI-powered destination suggestions and 3-day itinerary recommendations.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Trip Management**: Create, edit, and manage personal trips
- **AI-Powered Suggestions**: Get destination recommendations from external travel API
- **3-Day Itineraries**: Automatic itinerary generation with activities, locations, and timing
- **Community Features**: Share trips, like, comment, and discover public itineraries
- **Responsive Design**: Modern UI that works on all devices
- **Theme Support**: Light/dark mode toggle

## Tech Stack

### Frontend
- **React.js** with Next.js 13 (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **SQLite** database (easily switchable to PostgreSQL/MySQL)
- **JWT** for authentication
- **bcryptjs** for password hashing

### External Integration
- **Travel API**: `http://127.0.0.1:5000/api/destinations`
- **API Key**: `globetrotter-12345`

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Odoo_finalround
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Database Setup
```bash
# Navigate to backend directory
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 4. Environment Configuration
Create `.env` files in the backend directory:

```bash
# backend/.env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
PORT=5000

# External API Configuration
API_ENABLED=false  # Set to 'true' to enable external API calls
EXTERNAL_API_URL="http://127.0.0.1:5000/api/destinations"
EXTERNAL_API_KEY="globetrotter-12345"
```

**API Configuration Options:**
- **`API_ENABLED=false`**: Uses mock data (recommended for development)
- **`API_ENABLED=true`**: Attempts to call external API, falls back to mock data on failure
- **`EXTERNAL_API_URL`**: The external API endpoint for destination suggestions
- **`EXTERNAL_API_KEY`**: Authentication key for the external API

**Note**: Copy `env.example` to `.env` and modify as needed.

## Running the Application

### Option 1: Using Root Scripts (Recommended)
```bash
# From the root directory
npm run dev          # Start both frontend and backend
npm run dev:backend  # Start only backend
npm run dev:frontend # Start only frontend
```

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend
cd backend
npm run dev:working

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Option 3: Using Batch Scripts (Windows)
```bash
# Start both servers
start-servers.bat

# Or start individually
start-working.bat    # Backend only
start-frontend.bat   # Frontend only
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/demo` - Demo login

### Trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/my` - Get user's trips
- `GET /api/trips/public` - Get public trips
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Destinations & Itineraries
- `GET /api/destinations/suggestions` - Get destination suggestions
- `GET /api/destinations/:id/itinerary` - Get 3-day itinerary for destination

### System & Monitoring
- `GET /api/status` - Get API status and configuration information
- `GET /health` - Health check endpoint

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password
- `DELETE /api/user/delete-account` - Delete account

### Community Features
- `POST /api/trips/:id/like` - Like a trip
- `POST /api/trips/:id/comment` - Comment on a trip
- `GET /api/trips/:id/reviews` - Get trip reviews

## External API Integration

The application integrates with an external travel API to provide destination suggestions and 3-day itineraries:

- **Base URL**: `http://127.0.0.1:5000/api/destinations`
- **Authentication**: Bearer token with key `globetrotter-12345`
- **Features**:
  - Destination search and suggestions
  - 3-day itinerary generation
  - Activity recommendations
  - Location and timing suggestions

## Database Schema

The application uses Prisma with the following main models:

- **User**: Authentication and profile information
- **Trip**: Trip details and metadata
- **Activity**: Individual activities within trips
- **Stop**: Location stops during trips
- **City**: Destination cities with metadata
- **Comment**: User comments on trips
- **Like**: User likes on trips

## Project Structure

```
Odoo_finalround/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index-simple.ts # Main server file
│   │   ├── controllers/    # Route controllers
│   │   └── middleware/     # Authentication & validation
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── frontend/                # React/Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   └── lib/            # Utility functions
│   └── package.json
├── package.json             # Root package.json with scripts
└── README.md               # This file
```

## Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes in both frontend and backend
3. Test thoroughly
4. Submit pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 5000 is available
- Ensure all dependencies are installed
- Check database connection

**Frontend won't start:**
- Check if port 3000 is available
- Ensure backend is running first
- Check for TypeScript compilation errors

**Database issues:**
- Run `npx prisma generate` to regenerate client
- Check database file permissions
- Reset database with `npx prisma migrate reset`

**External API issues:**
- Verify API endpoint is accessible
- Check API key configuration
- Ensure external service is running
- Check `/api/status` endpoint for configuration details
- Set `API_ENABLED=false` to use mock data only

### Getting Help
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure database is properly set up
4. Check network connectivity for external APIs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
