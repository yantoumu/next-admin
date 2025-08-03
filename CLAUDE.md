# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 enterprise admin dashboard with PostgreSQL database, JWT authentication, and role-based access control (RBAC). Built for production deployment with type safety and security-first architecture.

## Technology Stack

### Core Framework
- **Next.js 15** - App Router, Server Components, API Routes
- **React 18** - Server-side rendering, React Hook Form for forms
- **TypeScript 5** - Full type safety across the stack
- **PostgreSQL** - Primary database with Prisma ORM

### Authentication & Security
- **JWT** - Token-based authentication (jsonwebtoken)
- **bcrypt** - Password hashing and validation
- **Zod** - Runtime validation for API inputs
- **RBAC** - 4-tier role system with granular permissions

### UI & Styling
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - Radix UI-based component library
- **Lucide React** - Icon system
- **next-themes** - Dark mode support

## Database Architecture

### PostgreSQL with Prisma
```bash
# Database commands
npx prisma db push     # Sync schema with database
npx prisma generate    # Generate Prisma Client
npx tsx prisma/seed.ts # Seed initial data
```

### User Model Schema
- **Roles**: super_admin, admin, member, viewer
- **Security**: bcrypt hashed passwords, JWT tokens
- **Audit**: created_at, updated_at timestamps

## Authentication System

### JWT Implementation
- Tokens stored in httpOnly cookies
- 7-day expiration with secure flag in production
- Payload includes userId, email, role
- Token validation on every protected route

### Role Hierarchy
```
super_admin (3) > admin (2) > member (1) > viewer (0)
```

### Permission Matrix
- `users.*` - User management (super_admin, admin)
- `settings.*` - System settings (super_admin only)
- `dashboard.view` - Dashboard access (all roles)
- `profile.*` - Profile management (all roles)

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint checks
npm run type-check   # TypeScript validation

# Database
npm run seed         # Initialize default users
```

## API Design Pattern

### Standard Response Format
```typescript
interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}
```

### API Route Template
```typescript
// 1. Authentication check
const user = await requireAuth()

// 2. Permission validation
await requirePermission('resource.action')

// 3. Zod validation
const validated = schema.parse(await request.json())

// 4. Business logic with Prisma
const result = await prisma.model.operation()

// 5. Standardized response
return NextResponse.json(createSuccessResponse(result))
```

## Project Structure

```
app/
├── (auth)/login/          # Public auth pages
├── dashboard/             # Protected pages
│   ├── users/            # User management
│   ├── settings/         # System settings
│   └── profile/          # User profile
├── api/                  # API routes
│   ├── auth/            # Auth endpoints
│   └── users/           # CRUD operations
lib/
├── db.ts                # Prisma client setup
├── auth.ts              # JWT authentication
├── auth-middleware.ts   # Permission checks
├── permissions.ts       # RBAC definitions
└── services/           # Business logic layer
```

## Security Checklist

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=<32+ character secret>
NODE_ENV=production
```

### Authentication Flow
1. User submits email/password
2. Validate credentials against PostgreSQL
3. Generate JWT with user data
4. Set httpOnly cookie with token
5. Validate token on each request
6. Check permissions for protected resources

### Data Validation
- Zod schemas for all API inputs
- Prisma type safety for database queries
- Server-side validation as authoritative source

## Common Patterns

### Page-Level Auth Check
```typescript
export default async function ProtectedPage() {
  await requirePermission('resource.view')
  // Page content
}
```

### API Auth Middleware
```typescript
export async function GET() {
  try {
    await requirePermission('resource.view')
    // Handler logic
  } catch (error) {
    return handleAPIError(error)
  }
}
```

### Client-Side Permission Check
```typescript
<PermissionGuard permission="users.create">
  <Button>Create User</Button>
</PermissionGuard>
```

## Testing & Deployment

### Pre-deployment Checklist
1. `npm run build` - No TypeScript errors
2. `npm run lint` - Clean ESLint output
3. Update JWT_SECRET for production
4. Configure DATABASE_URL with SSL
5. Set NODE_ENV=production

### Default Test Accounts
- admin@example.com / admin123456 (super_admin)
- manager@example.com / manager123456 (admin)  
- member@example.com / member123456 (member)
- viewer@example.com / viewer123456 (viewer)

## Troubleshooting

### Common Issues
1. **JWT Errors**: Check JWT_SECRET is set and consistent
2. **Database Connection**: Verify DATABASE_URL and PostgreSQL access
3. **Permission Denied**: Confirm user role has required permissions
4. **Build Errors**: Run `npm run type-check` to identify issues

## Database Safety Guidelines

### ⚠️ NEVER Use in Production:
- ❌ `npx prisma db push` - Can overwrite schema and cause data loss
- ❌ Direct schema modifications without backup
- ❌ Untested migrations on production data

### ✅ ALWAYS Follow Safe Migration Process:

#### 1. Pre-Migration Safety Check
```bash
# Run safety check script
npx tsx scripts/check-db-safety.ts
```

#### 2. Backup Your Database
```bash
# PostgreSQL backup
pg_dump -U username -h host -d database > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### 3. Use Migration Scripts
```bash
# Option A: Prisma Migrate (Development)
npx prisma migrate dev --create-only --name your_migration_name

# Option B: Manual SQL (Production)
psql -U username -h host -d database < prisma/migrations/manual_add_tasks.sql
```

#### 4. Verify Changes
```bash
# Regenerate Prisma Client
npx prisma generate

# Test the changes
npm run dev
```

#### 5. Rollback Plan
```sql
-- If something goes wrong, use rollback script
psql -U username -h host -d database < prisma/migrations/rollback_tasks.sql
```

### Migration Files Provided:
- `prisma/migrations/manual_add_tasks.sql` - Safe migration script for tasks
- `prisma/migrations/rollback_tasks.sql` - Rollback script if needed
- `scripts/check-db-safety.ts` - Pre-migration safety check

### Production Checklist:
1. ✅ Run safety check script first
2. ✅ Always backup before migrations
3. ✅ Test on staging environment
4. ✅ Use transactions for SQL execution
5. ✅ Have rollback plan ready
6. ✅ Monitor after deployment