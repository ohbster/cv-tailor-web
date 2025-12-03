# CV Tailor - Development Progress

## Project Overview
A full-stack web application for creating and tailoring resumes/CVs to match job descriptions. Built with Next.js frontend and FastAPI backend.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Runtime**: Node.js 20.17.0

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0
- **Database**: MySQL (Kubernetes with port-forward)
- **Python**: 3.11 (conda environment: `resume-adjuster`)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: UUIDs for primary keys, unique email constraints

### Infrastructure
- **Database Host**: Kubernetes (kubectl port-forward pod/mysql 3306:3306)
- **Backend URL**: http://localhost:8000
- **Frontend URL**: http://localhost:3000

## Completed Features ✅

### Database & Backend
- [x] Generated ORM models from existing MySQL database using sqlacodegen
- [x] 16 SQLAlchemy models with relationships:
  - CANDIDATE, JD (Job Description), RESUME, SKILLS, CERTS
  - Junction tables for many-to-many relationships
  - WORK_EXPERIENCE, PROJECTS
- [x] FastAPI application with CORS configured
- [x] Auto-generated Swagger documentation at `/docs`
- [x] SQLAdmin panel for database management
- [x] Environment configuration with `.env` file
- [x] Database connection with python-dotenv for environment variables

### Authentication & Security ✅ (Dec 3, 2025)
- [x] **JWT Authentication System**
  - Token-based auth with HS256 algorithm
  - 30-minute token expiration
  - Secure secret key generation
- [x] **Password Security**
  - Bcrypt hashing (bcrypt 4.0.1)
  - 72-byte password limit handling
  - Password validation (8-72 characters)
- [x] **Database Migration**
  - Changed CANDIDATE.id from INT to CHAR(36) UUID
  - Added password_hash VARCHAR(255) field
  - Added unique constraint on email addresses
  - Updated all foreign key columns to CHAR(36)
  - Truncated test data (clean slate)
- [x] **Auth Endpoints**
  - `POST /auth/register` - User registration
  - `POST /auth/login` - OAuth2 form-based login
  - `POST /auth/login/json` - JSON login for frontend
  - `GET /auth/me` - Get current user info
- [x] **Protected Endpoints**
  - All candidate endpoints require authentication
  - Users can only access their own data
  - `GET /candidates/me` - Get own profile
  - `PUT /candidates/me` - Update own profile
  - `DELETE /candidates/me` - Delete own account
- [x] **Code Quality**
  - Fixed circular imports (consolidated to app.models)
  - Removed duplicate model definitions
  - TYPE_CHECKING for forward references
  - Updated all CRUD operations for UUID support

### Frontend
- [x] Next.js project initialized with TypeScript and Tailwind CSS
- [x] Typed API client library (`lib/api.ts`) with all backend endpoints
- [x] Environment configuration (`.env.local`)
- [x] Homepage with gradient design and action cards
- [x] Profile creation form (`/profile/create`)
  - Form validation
  - URL normalization (auto-adds https://)
  - Error handling and loading states
- [x] Candidate detail page (`/candidates/[id]`)
  - Success message after creation
  - Display candidate information
  - Clickable contact links (email, phone)
  - Social media profile links (LinkedIn, GitHub)
  - Next steps cards (placeholders)

### Frontend Authentication ✅ (Dec 3, 2025)
- [x] **NextAuth.js Integration**
  - Installed next-auth v5
  - Configured Credentials provider
  - JWT session strategy (30min expiry)
  - NEXTAUTH_SECRET generated
- [x] **Authentication Pages**
  - `/auth/signin` - Beautiful signin form
  - `/auth/signup` - Registration with full profile fields
  - Auto-signin after registration
  - Error handling and loading states
- [x] **Session Management**
  - AuthProvider wrapper component
  - Session accessible throughout app
  - Protected routes with middleware
  - Auto-redirect to signin if not authenticated
- [x] **API Client Updates**
  - Token support in fetchAPI wrapper
  - Updated candidate endpoints for auth
  - `candidateAPI.getMe()` - Get own profile
  - `candidateAPI.updateMe()` - Update profile
  - `candidateAPI.deleteMe()` - Delete account
- [x] **Homepage Updates**
  - Show Sign In/Sign Up buttons when logged out
  - Display user name and Sign Out when logged in
  - Dynamic navigation based on auth state
- [x] **Route Protection**
  - Middleware protects `/profile/*`, `/candidates/*`, `/resumes/*`, `/dashboard/*`
  - Automatic redirect to signin for unauthenticated users
  - Callback URL preservation

### Development Environment
- [x] Conda environment `resume-adjuster` with all Python dependencies
- [x] Backend running with auto-reload (uvicorn)
- [x] Frontend running with hot-reload (Next.js Turbopack)
- [x] MySQL port-forward from Kubernetes

## Current State

### Working Features
✅ User can create a candidate profile with:
- Full name (required)
- Email (required)
- Phone (optional)
- LinkedIn URL (optional, auto-normalized)
- GitHub URL (optional, auto-normalized)

✅ Profile data is saved to MySQL database
✅ User is redirected to success page showing their profile
✅ All contact information displayed with proper formatting

### Known Issues/Limitations
✅ **Security Concerns** (RESOLVED Dec 3, 2025):
- ✅ Authentication implemented with JWT tokens
- ✅ Email addresses now unique in database
- ✅ Using UUID primary keys (not guessable)
- ⚠️ Frontend session management (in progress)

⚠️ **Missing Features**:
- Skills management
- Certifications management
- Work experience management
- Projects management
- Job description forms
- Resume generation/tailoring logic

## Files Created/Modified

### Frontend (`/home/ohbster/Development/AI/cv-tailor-web/`)
```
cv-tailor-web/
├── .env.local                          # Backend API URL + NextAuth config
├── .env.example                        # Template for environment variables
├── middleware.ts                       # Route protection middleware ⭐ NEW
├── lib/
│   ├── api.ts                          # Typed API client with auth tokens (updated)
│   └── auth.ts                         # NextAuth configuration ⭐ NEW
├── components/
│   └── AuthProvider.tsx                # Session provider wrapper ⭐ NEW
├── app/
│   ├── layout.tsx                      # Root layout with AuthProvider (updated)
│   ├── page.tsx                        # Homepage with auth UI (updated)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts            # NextAuth API route ⭐ NEW
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx                # Sign in page ⭐ NEW
│   │   └── signup/
│   │       └── page.tsx                # Sign up page ⭐ NEW
│   ├── profile/
│   │   └── create/
│   │       └── page.tsx                # Profile creation form
│   └── candidates/
│       └── [id]/
│           └── page.tsx                # Candidate detail page (dynamic route)
└── package.json                        # Dependencies (includes next-auth)
```

### Backend (`/home/ohbster/Development/AI/ResumeAdjuster/backend/`)
```
backend/
├── .env                                # Database credentials + auth secrets
├── .env.example                        # Template for environment variables
├── requirements.txt                    # Python dependencies (includes passlib, python-jose)
├── migrate_auth.py                     # One-time migration script for auth
├── app/
│   ├── __init__.py
│   ├── main.py                         # FastAPI app entry point
│   ├── database.py                     # SQLAlchemy engine & session (with dotenv)
│   ├── auth.py                         # Authentication utilities (JWT, bcrypt) ⭐ NEW
│   ├── models/                         # 16 ORM models (UUID primary keys)
│   ├── schemas/                        # Pydantic schemas (includes auth schemas)
│   ├── crud/                           # Database operations (UUID support)
│   └── api/
│       ├── auth.py                     # Auth endpoints ⭐ NEW
│       ├── candidates.py               # Protected candidate endpoints (modified)
│       ├── resumes.py
│       ├── job_descriptions.py
│       └── skills.py
```

## Development Commands

### Start Backend
```bash
cd /home/ohbster/Development/AI/ResumeAdjuster/backend
conda activate resume-adjuster
uvicorn app.main:app --reload
```

### Start Frontend
```bash
cd /home/ohbster/Development/AI/cv-tailor-web
npm run dev
```

### Database Port-Forward (if not running)
```bash
kubectl port-forward pod/mysql 3306:3306
```

### Install Backend Dependencies
```bash
conda activate resume-adjuster
pip install -r requirements.txt
```

### Install Frontend Dependencies
```bash
npm install
```

## API Endpoints Currently Used

### Authentication (NEW Dec 3, 2025) 🔐
- `POST /auth/register` - User registration with password
- `POST /auth/login` - OAuth2 form-based login
- `POST /auth/login/json` - JSON login for frontend
- `GET /auth/me` - Get current authenticated user

### Candidates (Protected - Requires Auth) 🔒
- `GET /candidates/me` - Get own profile
- `GET /candidates/{id}` - Get candidate by ID (ownership required)
- `PUT /candidates/me` - Update own profile
- `DELETE /candidates/me` - Delete own account

### Available but Not Yet Used in Frontend
- Skills API (`/skills/`)
- Certifications API (`/certifications/`)
- Work Experience API (`/work-experience/`)
- Projects API (`/projects/`)
- Job Descriptions API (`/job-descriptions/`)
- Resumes API (`/resumes/`)

## Environment Variables

### Backend (`.env`)
```bash
DATABASE_URL=mysql+pymysql://root:badpasswd@127.0.0.1:3306/testdb
APP_ENV=development
DEBUG=True
API_HOST=0.0.0.0
API_PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Authentication (NEW Dec 3, 2025)
SECRET_KEY=QXewUTFQmCAwH74W7jyydbsK9t66AAX0Qw_ulsWIjxQ
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth (NEW Dec 3, 2025)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=xZXv9w4ROLs7R08f8qxkmtSLpf2N9FKLRMAmoGBT+EM=
```

---

## 🎉 Latest Achievement: Full-Stack Authentication (Dec 3, 2025)

Successfully implemented end-to-end authentication system:

### Backend (FastAPI)
- ✅ JWT tokens with bcrypt password hashing
- ✅ UUID primary keys (not guessable)
- ✅ Unique email constraints
- ✅ Protected API endpoints
- ✅ Database migration completed
- ✅ Fixed all circular imports

### Frontend (Next.js)
- ✅ NextAuth.js integration
- ✅ Beautiful sign in/sign up pages
- ✅ Session management
- ✅ Protected routes with middleware
- ✅ Token-based API calls
- ✅ Dynamic UI based on auth state

### Testing Done
- ✅ User registration working
- ✅ Login returning JWT tokens
- ✅ Token validation working
- ✅ Protected endpoints accessible with valid tokens
- ✅ Frontend ready for testing (restart required)

**Next Steps**: Restart frontend server to test full authentication flow!
```bash
cd /home/ohbster/Development/AI/cv-tailor-web
npm run dev
```

## Key Learnings & Fixes Applied

1. **Next.js 15+ params are async** - Must use `React.use()` to unwrap params in dynamic routes
2. **URL input validation** - Changed from `type="url"` to `type="text"` with custom normalization
3. **Environment variables** - Backend needed `python-dotenv` and `load_dotenv()` call
4. **Conda environment** - Created dedicated `resume-adjuster` environment for dependencies
5. **API client naming** - Method is `getById()` not `getOne()`

## Next Session Starting Point

Ready to implement authentication and security improvements (see ROADMAP.md).

---

**Last Updated**: December 3, 2025
**Current Sprint**: MVP Development
**Next Milestone**: Authentication & Authorization

---

## 📚 Authentication System Explained (For Beginners)

### What is Authentication?

Authentication is proving "you are who you say you are." Think of it like showing your ID card to enter a building. In our app, users create an account with a password, and we verify their identity each time they log in.

### How Our Authentication Works

#### 1. **Password Storage (Never Save Plain Passwords!)**

When a user creates an account:
```
User types: "mypassword123"
         ↓
Bcrypt hashing (one-way encryption)
         ↓
Stored in database: "$2b$12$xKj7..."  ← This CANNOT be reversed to get the original password
```

**Why?** If hackers steal the database, they can't see anyone's actual password.

#### 2. **JWT Tokens (Digital Badges)**

After login, instead of asking for password every time, we give the user a **JWT token** (like a temporary badge):

```
User logs in successfully
         ↓
Server creates JWT token: "eyJhbGciOiJIUzI1NiIsInR5..."
         ↓
Token contains: user_id, email, expiration time (30 minutes)
         ↓
Frontend stores token and sends it with every request
```

**Why?** It's more secure than sending passwords repeatedly, and the server can verify it's real without checking the database each time.

#### 3. **Protected Routes (Bouncers at the Door)**

Some pages require authentication:
```
User tries to access /profile
         ↓
Middleware checks: "Do you have a valid token?"
         ↓
YES → Show the page
NO  → Redirect to /auth/signin
```

### The Complete Flow (Step by Step)

#### **Registration Flow:**
```
1. User fills signup form (/auth/signup)
2. Frontend sends: email, password, full_name, etc.
3. Backend checks: "Is this email already used?"
4. Backend hashes password with bcrypt
5. Backend creates new user with UUID (e.g., "3ba0dd1b-8e22-4a4c-b064-bf5c75858f69")
6. Backend returns: User created successfully
7. Frontend auto-logs user in
8. User gets JWT token and redirected to homepage
```

#### **Login Flow:**
```
1. User enters email + password (/auth/signin)
2. Frontend sends credentials to backend
3. Backend finds user by email
4. Backend verifies password hash matches
5. Backend creates JWT token with user info
6. Backend returns token
7. Frontend stores token in NextAuth session
8. User redirected to homepage (now logged in)
```

#### **Making Authenticated Requests:**
```
1. User clicks "My Profile"
2. Frontend calls: GET /candidates/me with token in header
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...
3. Backend extracts token from header
4. Backend verifies token signature (is it real?)
5. Backend checks expiration (is it still valid?)
6. Backend extracts user_id from token
7. Backend fetches user's data from database
8. Backend returns user data
9. Frontend displays profile
```

### Key Security Concepts Used

#### **1. UUID Primary Keys**
```
❌ BAD:  id = 1, 2, 3, 4...  (easy to guess: "What's user 2's data?")
✅ GOOD: id = "3ba0dd1b-8e22-4a4c-b064-bf5c75858f69"  (impossible to guess)
```

#### **2. Password Hashing (Bcrypt)**
```
❌ BAD:  password = "mypassword123"  (if database leaks, everyone's password exposed)
✅ GOOD: password_hash = "$2b$12$xKj7..."  (useless to hackers, can't reverse it)
```

#### **3. Unique Email Constraint**
```
❌ BAD:  Multiple users with same email
✅ GOOD: Database prevents duplicate emails (you can't register with john@example.com twice)
```

#### **4. Token Expiration**
```
❌ BAD:  Token valid forever (if stolen, hacker has permanent access)
✅ GOOD: Token expires in 30 minutes (if stolen, only works for 30 min)
```

#### **5. Ownership Validation**
```
❌ BAD:  Any logged-in user can access any profile
✅ GOOD: Backend checks: "Does this token's user_id match the requested profile?"
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend (http://localhost:3000)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pages:                                                    │  │
│  │  • /auth/signin   (Sign In Form)                         │  │
│  │  • /auth/signup   (Registration Form)                    │  │
│  │  • /profile       (Protected - needs token)              │  │
│  │  • /              (Homepage - dynamic based on auth)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↕                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ NextAuth.js Session Management                           │  │
│  │  • Stores JWT token from backend                         │  │
│  │  • Provides useSession() hook                            │  │
│  │  • Auto-refreshes session                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↕                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Client (lib/api.ts)                                  │  │
│  │  • Adds "Authorization: Bearer <token>" to requests      │  │
│  │  • Handles errors (401 = not authenticated)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP Requests with JWT Token
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER                                   │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI Backend (http://localhost:8000)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Auth Endpoints (app/api/auth.py)                         │  │
│  │  • POST /auth/register  → Create user + hash password    │  │
│  │  • POST /auth/login     → Verify password + issue token  │  │
│  │  • GET  /auth/me        → Return current user info       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↕                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Auth Utilities (app/auth.py)                             │  │
│  │  • get_password_hash()     → Bcrypt hashing              │  │
│  │  • verify_password()       → Check hash matches          │  │
│  │  • create_access_token()   → Generate JWT                │  │
│  │  • get_current_user()      → Verify token & get user     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↕                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Protected Endpoints (app/api/candidates.py)              │  │
│  │  • GET  /candidates/me   → Requires valid token          │  │
│  │  • PUT  /candidates/me   → Requires valid token          │  │
│  │  • DELETE /candidates/me → Requires valid token          │  │
│  │                                                           │  │
│  │  All use: Depends(get_current_user)                      │  │
│  │  FastAPI auto-checks token before running endpoint       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↕                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Database Layer (SQLAlchemy)                              │  │
│  │  • CANDIDATE table with UUID primary key                 │  │
│  │  • password_hash field (VARCHAR 255)                     │  │
│  │  • email field (UNIQUE constraint)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL Database                               │
│  • Kubernetes pod (port-forwarded to localhost:3306)           │
│  • Stores: users, resumes, skills, certifications, etc.        │
└─────────────────────────────────────────────────────────────────┘
```

### Common Terms Explained

- **JWT (JSON Web Token)**: A digitally signed string containing user information. Think of it as a tamper-proof sticky note.
  
- **Bcrypt**: A algorithm that converts passwords into random-looking strings. It's intentionally slow to make hacking harder.

- **UUID (Universally Unique Identifier)**: A 36-character ID like `3ba0dd1b-8e22-4a4c-b064-bf5c75858f69`. Statistically impossible to guess.

- **Bearer Token**: The word "Bearer" in `Authorization: Bearer <token>` means "whoever holds (bears) this token is authorized."

- **Middleware**: Code that runs before your page loads. Our middleware checks if you're logged in.

- **Session**: Your login state. As long as your session is active, you don't need to log in again.

- **CORS (Cross-Origin Resource Sharing)**: Allows frontend (localhost:3000) to talk to backend (localhost:8000).

### What We DON'T Have Yet (RBAC = Role-Based Access Control)

Right now, all authenticated users have the same permissions. In the future, we might add:
- **Admin role**: Can see all users' data
- **User role**: Can only see their own data
- **Moderator role**: Can edit others' data but not delete

This would require:
1. Adding a `role` field to CANDIDATE table
2. Checking role in endpoints: `if current_user.role != "admin": raise HTTPException`
3. Creating role-checking decorators

### Security Best Practices We Follow

✅ **Passwords never stored in plain text**
✅ **Passwords never sent over HTTP** (in production, use HTTPS)
✅ **Tokens expire after 30 minutes**
✅ **UUIDs prevent ID guessing attacks**
✅ **Unique emails prevent duplicate accounts**
✅ **Users can only access their own data**
✅ **Environment variables for secrets** (not hardcoded)

### What Could Still Be Improved

⚠️ **Email verification**: Right now anyone can register with any email
⚠️ **Password reset**: No "forgot password" flow yet
⚠️ **Rate limiting**: No protection against brute-force login attempts
⚠️ **Two-factor authentication (2FA)**: Not implemented
⚠️ **HTTPS**: Currently using HTTP (fine for development, bad for production)
⚠️ **Refresh tokens**: Tokens can't be renewed, must login again after 30 min

---
