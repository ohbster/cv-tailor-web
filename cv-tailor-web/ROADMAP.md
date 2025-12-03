# CV Tailor - Roadmap

## 🚀 Current Sprint: Authentication & Security

### Phase 1: Security Foundations (IMMEDIATE)
**Goal**: Implement authentication and fix security vulnerabilities

#### Database Changes
- [ ] Migrate `CANDIDATE.id` from INT to UUID (BINARY(16) or CHAR(36))
- [ ] Add UNIQUE constraint on `CANDIDATE.email`
- [ ] Add password hash field to CANDIDATE table
- [ ] Create database migration script (Alembic)

#### Backend Authentication
- [ ] Install dependencies: `passlib`, `python-jose[cryptography]`, `python-multipart`
- [ ] Create authentication utilities:
  - [ ] Password hashing functions
  - [ ] JWT token generation/validation
  - [ ] Get current user dependency
- [ ] Add authentication endpoints:
  - [ ] `POST /auth/register` - Create account
  - [ ] `POST /auth/login` - Login and get token
  - [ ] `GET /auth/me` - Get current user
  - [ ] `POST /auth/logout` - Logout (optional)
- [ ] Protect candidate endpoints:
  - [ ] Add `get_current_user` dependency to routes
  - [ ] Filter queries to only return current user's data
  - [ ] Prevent users from accessing other users' profiles

#### Frontend Authentication
- [ ] Install NextAuth.js: `npm install next-auth`
- [ ] Configure NextAuth.js with Credentials provider
- [ ] Create authentication pages:
  - [ ] `/auth/signin` - Login page
  - [ ] `/auth/signup` - Registration page
  - [ ] `/auth/error` - Error page
- [ ] Add authentication middleware to protect routes
- [ ] Update API client to include JWT token in requests
- [ ] Add session management
- [ ] Add logout functionality
- [ ] Update navigation to show logged-in user

#### UI/UX Updates
- [ ] Add authentication state to navbar
- [ ] Show "Login" / "Sign Up" when not authenticated
- [ ] Show user name and "Logout" when authenticated
- [ ] Redirect to login if accessing protected pages while unauthenticated
- [ ] Add loading states during authentication
- [ ] Add proper error messages for auth failures

### Success Criteria
✅ Users must sign up with email/password
✅ Users must login to access the app
✅ Users can only view/edit their own profile
✅ Email addresses are unique
✅ Profile IDs are UUIDs (non-guessable)
✅ JWT tokens expire appropriately
✅ Sessions persist across page reloads

---

## 📋 Phase 2: Core Features (NEXT)

### Skills Management
- [ ] Create skills selection/input page
- [ ] Multi-select or autocomplete for common skills
- [ ] Allow custom skill entry
- [ ] Display skills on candidate profile
- [ ] Edit/delete skills

### Certifications Management
- [ ] Create certification input form
  - [ ] Certification name
  - [ ] Issuing organization
  - [ ] Issue date / Expiration date
  - [ ] Credential ID
  - [ ] Certificate URL
- [ ] Link certifications to candidate
- [ ] Display certifications on profile
- [ ] Edit/delete certifications

### Work Experience Management
- [ ] Create work experience form
  - [ ] Company name
  - [ ] Job title
  - [ ] Start date / End date
  - [ ] Description/responsibilities
  - [ ] Technologies used
- [ ] Support multiple work experiences
- [ ] Display timeline view
- [ ] Edit/delete work experience

### Projects Management
- [ ] Create project input form
  - [ ] Project name
  - [ ] Description
  - [ ] Technologies used
  - [ ] Project URL
  - [ ] GitHub repo link
- [ ] Support multiple projects
- [ ] Display projects on profile
- [ ] Edit/delete projects

---

## 📋 Phase 3: Job Description & Resume Generation

### Job Description Management
- [ ] Create job description input form
  - [ ] Company name
  - [ ] Job title
  - [ ] Required skills
  - [ ] Preferred skills
  - [ ] Job description text
- [ ] Parse job descriptions (extract skills automatically)
- [ ] List all saved job descriptions
- [ ] Edit/delete job descriptions

### Resume Generation
- [ ] Create resume builder interface
- [ ] Select which experiences/projects to include
- [ ] Tailor bullet points based on job description
- [ ] Multiple resume templates
- [ ] Preview resume
- [ ] Export as PDF
- [ ] Export as Word document
- [ ] Track which resumes were used for which jobs

### Smart Matching
- [ ] Compare candidate skills vs job requirements
- [ ] Show skill match percentage
- [ ] Highlight missing skills
- [ ] Suggest resume improvements
- [ ] Recommend which projects to highlight

---

## 📋 Phase 4: Polish & Advanced Features (FUTURE)

### Email Verification
- [ ] Send verification email on signup
- [ ] Email verification token system
- [ ] Prevent unverified users from certain actions
- [ ] Resend verification email option

### OAuth Integration
- [ ] Add Google OAuth
- [ ] Add GitHub OAuth
- [ ] Add LinkedIn OAuth (for importing profile data)

### Role-Based Access Control (RBAC)
- [ ] Add user roles (user, admin, premium)
- [ ] Admin dashboard
- [ ] Usage analytics
- [ ] User management for admins

### Resume Analytics
- [ ] Track resume views
- [ ] Track applications sent
- [ ] Interview tracking
- [ ] Offer tracking
- [ ] Success rate analytics

### AI-Powered Features
- [ ] AI-powered resume tailoring suggestions
- [ ] Auto-generate bullet points from job descriptions
- [ ] Cover letter generation
- [ ] Interview question preparation based on JD

### Collaboration Features
- [ ] Share resume with mentors/reviewers
- [ ] Comment/feedback system
- [ ] Version control for resumes
- [ ] Resume comparison (side-by-side)

### Mobile App
- [ ] React Native mobile app
- [ ] Or Progressive Web App (PWA)
- [ ] Mobile-optimized resume viewing

### Integrations
- [ ] Import from LinkedIn
- [ ] Export to LinkedIn
- [ ] Integrate with job boards (Indeed, LinkedIn Jobs)
- [ ] ATS compatibility checker

---

## 🐛 Technical Debt & Improvements

### Database
- [ ] Add proper indexes for performance
- [ ] Add database backups
- [ ] Implement soft deletes
- [ ] Add audit logging (who changed what, when)

### Testing
- [ ] Backend unit tests (pytest)
- [ ] Backend integration tests
- [ ] Frontend component tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright or Cypress)
- [ ] API contract tests

### DevOps
- [ ] Docker compose for local development
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deploy backend (AWS/GCP/Heroku)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Production database setup
- [ ] Monitoring and logging (Sentry)
- [ ] Performance monitoring

### Code Quality
- [ ] Backend linting (flake8, black)
- [ ] Frontend linting (ESLint)
- [ ] Type checking (mypy for backend)
- [ ] Pre-commit hooks
- [ ] Code review process

### Documentation
- [ ] API documentation improvements
- [ ] Frontend component documentation (Storybook)
- [ ] User guide/help documentation
- [ ] Developer onboarding guide
- [ ] Architecture decision records (ADRs)

---

## 📊 Milestones

### Milestone 1: Secure MVP ✅ (Target: Week 1)
- Authentication implemented
- Users can create profiles
- Basic CRUD operations work
- Security vulnerabilities addressed

### Milestone 2: Complete Profile Management (Target: Week 2-3)
- Skills, certifications, work experience, projects all manageable
- User can build complete professional profile
- Good UI/UX for data entry

### Milestone 3: Resume Generation (Target: Week 4-5)
- Job description input
- Resume generation from profile
- Basic tailoring functionality
- PDF export

### Milestone 4: Smart Features (Target: Week 6-8)
- Skill matching
- Resume suggestions
- Analytics
- Polish and bug fixes

### Milestone 5: Production Ready (Target: Week 9-10)
- Testing complete
- Deployed to production
- Monitoring in place
- Documentation complete

---

## 🎯 Success Metrics

### User Metrics
- [ ] 100+ registered users
- [ ] 500+ resumes generated
- [ ] 70%+ user satisfaction rating

### Technical Metrics
- [ ] <2s page load time
- [ ] 99.9% uptime
- [ ] <100ms API response time (p95)
- [ ] 80%+ test coverage

### Business Metrics
- [ ] Conversion rate: signup → first resume
- [ ] Retention rate: users returning within 7 days
- [ ] Feature adoption rates

---

**Last Updated**: December 3, 2025
**Current Phase**: Phase 1 - Security Foundations
**Next Review Date**: End of Week 1
