# AI Fitness Coach - Turborepo Monorepo

A comprehensive AI-powered fitness and nutrition coaching platform built with modern technologies in a Turborepo monorepo structure.

## 🏗️ Architecture Overview

This monorepo contains multiple applications and shared packages:

### Applications (`apps/`)
- **Mobile App** (React Native + Expo) - iOS and Android native app
- **Web App** (Next.js + PWA) - Progressive web application
- **Landing Page** (Vite + React) - Marketing website
- **API Service** (.NET Core 8) - Main REST API
- **Notification Service** (.NET Core 8) - Push notifications and messaging
- **Queue Processor** (.NET Core 8) - Background job processing

### Shared Packages (`packages/`)
- **shared-types** - TypeScript types and .NET shared models
- **ui-components** - Reusable React/React Native components
- **api-client** - TypeScript SDK for API communication
- **notification-client** - Client library for notifications
- **utils** - Shared utility functions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd dietApp
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Set up environment variables**
   ```powershell
   Copy-Item .env.development .env
   # Edit .env with your configuration
   ```

4. **Start development environment**
   ```powershell
   # Start all services with Docker
   docker-compose -f docker-compose.dev.yml up -d

   # Or start individual services
   npm run dev:mobile      # Mobile app (Expo)
   npm run dev:web-app     # Web app (Next.js)
   npm run dev:landing     # Landing page (Vite)
   npm run dev:api         # API service (.NET)
   ```

5. **Access applications**
   - Landing Page: http://localhost:3001
   - Web App: http://localhost:3000
   - Mobile App: Use Expo Go app with QR code
   - API Documentation: http://localhost:5000
   - API Swagger UI: http://localhost:5000/swagger

## 📱 Applications

### Mobile App (React Native + Expo)
- **Location**: `apps/mobile/`
- **Tech Stack**: React Native, Expo, TypeScript
- **Features**: Native iOS/Android app with push notifications
- **Development**: `npm run dev:mobile`

### Web App (Next.js + PWA)
- **Location**: `apps/web-app/`
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Features**: Progressive Web App with offline support
- **Development**: `npm run dev:web-app`

### Landing Page (Vite)
- **Location**: `apps/landing-page/`
- **Tech Stack**: Vite, React, TypeScript, Tailwind CSS
- **Features**: Marketing website with modern design
- **Development**: `npm run dev:landing`

### API Services (.NET Core)
- **Main API**: `apps/api/` - Core business logic and data
- **Notification Service**: `apps/notification-service/` - Push notifications
- **Queue Processor**: `apps/queue-processor/` - Background jobs
- **Tech Stack**: .NET 8, Entity Framework, SQL Server
- **Development**: `npm run dev:api`

## 📦 Shared Packages

### TypeScript Types (`packages/shared-types/`)
Shared type definitions for:
- User management
- Workout plans and sessions
- Nutrition tracking
- Progress monitoring
- AI recommendations

### UI Components (`packages/ui-components/`)
Reusable React/React Native components:
- Form components
- Navigation elements
- Data visualization
- Loading states

### API Client (`packages/api-client/`)
TypeScript SDK with:
- Authentication handling
- API endpoint methods
- Error handling
- Type safety

## 🔧 Development Commands

### Root Level Commands
```powershell
# Install all dependencies
npm install

# Build all packages and apps
npm run build

# Run linting across all packages
npm run lint

# Type check all TypeScript code
npm run type-check

# Run all tests
npm run test

# Clean all build artifacts
npm run clean
```

### Individual App Commands
```powershell
# Mobile app
npm run dev:mobile
npm run build:mobile
npm run test:mobile

# Web app
npm run dev:web-app
npm run build:web-app
npm run test:web-app

# Landing page
npm run dev:landing
npm run build:landing

# API services
npm run dev:api
npm run build:api
npm run test:api
```

## 🐳 Docker Development

### Start all services
```powershell
docker-compose -f docker-compose.dev.yml up -d
```

### View logs
```powershell
docker-compose -f docker-compose.dev.yml logs -f
```

### Stop all services
```powershell
docker-compose -f docker-compose.dev.yml down
```

## 🚢 Production Deployment

### Build production images
```powershell
docker-compose build
```

### Deploy with Docker Compose
```powershell
docker-compose up -d
```

### Environment Configuration
- Copy `.env.production` to `.env`
- Update all environment variables
- Configure external services (database, Redis, etc.)

## 🧪 Testing

### Unit Tests
```powershell
# Run all tests
npm run test

# Run tests for specific apps
npm run test:mobile
npm run test:web-app
npm run test:api
```

### E2E Tests
```powershell
# Run end-to-end tests
npm run test:e2e
```

## 📊 Monitoring & Observability

### Health Checks
- API Health: http://localhost:5000/health
- Notification Service: http://localhost:5001/health

### Logs
- Application logs are centralized through Docker Compose
- Use `docker-compose logs -f [service-name]` to view logs

### Metrics
- Built-in .NET metrics and monitoring
- Custom business metrics tracking

## 🔒 Security

### Authentication
- JWT-based authentication
- Refresh token rotation
- Multi-factor authentication support

### Data Protection
- Encrypted sensitive data
- GDPR compliance features
- Secure API communication

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Run tests: `npm run test`
4. Run linting: `npm run lint`
5. Create pull request

### Code Standards
- TypeScript for all frontend code
- C# with .NET 8 for backend services
- ESLint + Prettier for formatting
- Conventional commits

### Adding New Features
1. Update shared types if needed
2. Implement API endpoints
3. Update frontend clients
4. Add tests
5. Update documentation

## 📚 Documentation

### API Documentation
- Swagger UI: http://localhost:5000/swagger
- OpenAPI specification available

### Component Documentation
- Storybook: `npm run storybook`
- Component examples and usage

## 🌐 Infrastructure

### Required Services
- SQL Server (database)
- Redis (caching/sessions)
- SMTP server (email notifications)
- Cloud storage (file uploads)

### Optional Services
- Application Insights (monitoring)
- Sentry (error tracking)
- CDN (static asset delivery)

## 📈 Performance

### Optimization Features
- Code splitting in web apps
- Lazy loading components
- Image optimization
- CDN integration
- Database indexing

### Monitoring
- Performance metrics collection
- Real-time monitoring dashboards
- Automated alerting

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**
   - Check if ports 3000, 3001, 5000, 5001 are available
   - Modify port configurations in docker-compose files

2. **Database connection issues**
   - Ensure SQL Server is running
   - Check connection string in environment variables

3. **Package resolution issues**
   - Run `npm run clean` and `npm install`
   - Check workspace configuration in package.json

### Getting Help
- Check the logs: `docker-compose logs -f`
- Review environment variables
- Ensure all required services are running

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏗️ Tech Stack Summary

### Frontend
- **Mobile**: React Native + Expo
- **Web**: Next.js 14 + TypeScript
- **Landing**: Vite + React
- **Styling**: Tailwind CSS, React Native Paper
- **State Management**: React Context + Custom Hooks

### Backend
- **API**: .NET 8 + Entity Framework
- **Database**: SQL Server
- **Caching**: Redis
- **Authentication**: JWT
- **Background Jobs**: .NET Background Services

### DevOps
- **Monorepo**: Turborepo
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest, .NET Test Framework
- **Linting**: ESLint + Prettier

### External Integrations
- **AI**: OpenAI API
- **Nutrition Data**: Nutritionix API
- **Push Notifications**: FCM + APNS
- **Email**: SMTP + Templates

---

Built with ❤️ using modern development practices and cutting-edge technologies.
