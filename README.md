# WriteWise - AI-Powered Peer Review Platform

A comprehensive full-stack web application that revolutionizes writing education through AI-powered feedback, intelligent peer review matching, and detailed analytics.

## 🚀 Features

### Core Functionality
- **AI-Powered Feedback**: Instant feedback on structure, grammar, clarity, argument strength, and originality using advanced NLP models
- **Fair Peer Review**: Smart algorithm matches reviewers fairly, preventing bias and ensuring balanced workload distribution
- **Rich Text Editor**: Markdown support with inline grammar suggestions and real-time collaboration
- **Analytics Dashboard**: Comprehensive insights for students, reviewers, and faculty with performance trends and metrics

### Advanced Features
- **Real-Time Collaboration**: Live editing and comments (Google Docs style)
- **Plagiarism Detection**: AI-powered originality checking
- **Gamification**: Badges, streaks, and leaderboards to encourage participation
- **LMS Integration**: Seamless integration with Moodle, Canvas, and Google Classroom
- **Role-Based Access**: Student, Reviewer, Faculty, and Admin roles with appropriate permissions

### Security & Privacy
- **End-to-End Encryption**: Secure essay data transmission
- **GDPR Compliance**: Complete data protection and privacy controls
- **Role-Based Access Control**: Granular permissions system

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand + React Query
- **Rich Text Editor**: TipTap with collaboration features
- **Charts**: Recharts for analytics visualization

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **AI Integration**: OpenAI GPT-4 for feedback generation
- **Queue System**: BullMQ with Redis for background jobs
- **API Documentation**: Swagger/OpenAPI

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and queues
- **File Storage**: S3-compatible storage (Supabase/MinIO)

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- shadcn/ui
- TipTap (Rich Text Editor)
- React Query
- Zustand
- Recharts

### Backend (Dual Implementation)
**NestJS Backend:**
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- OpenAI API
- BullMQ
- Redis

**Python FastAPI Backend:**
- FastAPI
- Python 3.10+
- SQLite (development) / PostgreSQL (production)
- SQLAlchemy ORM
- JWT Authentication
- Google Gemini AI
- Celery
- Redis

### DevOps
- Docker
- GitHub Actions
- PostgreSQL
- Redis
- Vercel (Frontend)
- Fly.io/Render (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/writewise.git
   cd writewise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp apps/api/env.example apps/api/.env
   cp apps/web/env.example apps/web/.env.local
   
   # Edit the files with your configuration
   ```

4. **Set up the database (Choose one backend)**
   
   **Option A: NestJS Backend (PostgreSQL)**
   ```bash
   # Generate Prisma client
   cd apps/api
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database (optional)
   npx prisma db seed
   ```
   
   **Option B: Python FastAPI Backend (SQLite)**
   ```bash
   # Create virtual environment
   cd apps/backend
   python -m venv .venv
   
   # Activate virtual environment
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

5. **Start the development servers**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:web          # Frontend on http://localhost:3000
   npm run dev:api          # NestJS Backend on http://localhost:3001
   
   # For Python backend:
   cd apps/backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Setup

1. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

## 📱 Usage

### For Students
1. **Create Account**: Sign up with your email and role
2. **Write Essays**: Use the rich text editor with AI suggestions
3. **Submit for Review**: Submit essays for peer review
4. **Receive Feedback**: Get AI and human feedback
5. **Track Progress**: Monitor your writing improvement

### For Reviewers
1. **Get Assigned**: Receive fair essay assignments
2. **Review Essays**: Provide detailed feedback and scores
3. **Track Workload**: Monitor your review assignments
4. **Earn Recognition**: Build your reviewer reputation

### For Faculty
1. **Manage Courses**: Create and manage writing courses
2. **Monitor Progress**: Track student and reviewer performance
3. **Analytics**: Access detailed analytics and insights
4. **LMS Integration**: Sync with your learning management system

## 🔧 Development

### Project Structure
```
WriteWise/
├── apps/
│   ├── api/                 # NestJS backend API
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── ai/          # AI services and controllers
│   │   │   ├── analytics/   # Analytics endpoints
│   │   │   ├── auth/        # Authentication system
│   │   │   │   ├── dto/     # Data transfer objects
│   │   │   │   ├── guards/  # JWT auth guards
│   │   │   │   └── strategies/ # Auth strategies
│   │   │   ├── common/      # Shared utilities
│   │   │   │   └── prisma/  # Database service
│   │   │   ├── essays/      # Essay management
│   │   │   ├── reviews/     # Review system
│   │   │   ├── users/       # User management
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   ├── backend/             # Python FastAPI backend (alternative)
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── static/          # Static files
│   │   ├── app/
│   │   │   ├── models/      # SQLAlchemy models
│   │   │   ├── routers/     # API routes
│   │   │   ├── schemas/     # Pydantic schemas
│   │   │   ├── services/    # Business logic
│   │   │   ├── config.py    # Configuration
│   │   │   ├── db.py        # Database setup
│   │   │   ├── main.py      # FastAPI app
│   │   │   └── security.py  # Auth utilities
│   │   └── writewise_demo.db # SQLite database
│   └── web/                 # Next.js frontend
│       ├── Dockerfile
│       ├── next.config.js
│       ├── package.json
│       ├── src/
│       │   ├── app/         # App router pages
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/  # React components
│       │   │   ├── dashboard/    # Dashboard components
│       │   │   ├── essay-editor/ # Essay editing
│       │   │   ├── landing/      # Landing page
│       │   │   ├── review-system/ # Review components
│       │   │   └── ui/           # Base UI components
│       │   ├── hooks/       # Custom React hooks
│       │   ├── lib/         # Utilities and API client
│       │   ├── types/       # TypeScript definitions
│       │   └── utils/       # Helper functions
│       ├── tailwind.config.js
│       └── tsconfig.json
├── packages/
│   ├── shared/              # Shared utilities (placeholder)
│   └── ui/                  # UI components (placeholder)
├── docker-compose.yml       # Development environment
├── Dockerfile               # Root Dockerfile
├── package.json             # Root package.json (monorepo)
├── turbo.json               # Turborepo configuration
└── README.md
```

### Available Scripts
```bash
# Development
npm run dev              # Start all services
npm run dev:web          # Start frontend only
npm run dev:api          # Start backend only

# Building
npm run build            # Build all applications
npm run build:web        # Build frontend
npm run build:api        # Build backend

# Testing
npm run test             # Run all tests
npm run test:web         # Test frontend
npm run test:api         # Test backend

# Linting
npm run lint             # Lint all code
npm run lint:web         # Lint frontend
npm run lint:api         # Lint backend

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
```

### API Documentation
Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation.

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   - Set up PostgreSQL database
   - Configure Redis instance
   - Set up OpenAI API key
   - Configure environment variables

2. **Docker Deployment**
   ```bash
   # Build production images
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Platform Deployment**
   - **Frontend**: Deploy to Vercel
   - **Backend**: Deploy to Fly.io or Render
   - **Database**: Use managed PostgreSQL (Supabase, Railway, etc.)

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="your-openai-api-key"
REDIS_URL="redis://host:port"
PORT=3001
NODE_ENV=production
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="https://your-api-domain.com"
NEXT_PUBLIC_APP_NAME="WriteWise"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- The Next.js team for the amazing framework
- The NestJS team for the robust backend framework
- All contributors and users of WriteWise

## 📞 Support

- **Documentation**: [docs.writewise.com](https://docs.writewise.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/writewise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/writewise/discussions)
- **Email**: support@writewise.com

---

**WriteWise** - Transforming writing education through AI and collaboration 🚀
#   W r i t e - W i s e - L o r d s - B i t s 
 
 