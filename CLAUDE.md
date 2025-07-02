# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a universal admin management framework built with Next.js 15 App Router, designed for rapid deployment and easy extension. The project uses a full-stack approach with server-rendered components and API routes.

## Technology Stack

- **Frontend**: Next.js 15 App Router + React 19
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Auth**: Supabase Auth + custom RBAC system
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack Query for server state
- **Build**: Turbopack

## Critical Configuration Requirements

### Tailwind CSS 4 + shadcn/ui Setup
The project requires specific Tailwind configuration for shadcn/ui compatibility:

1. **tailwind.config.ts must include**:
   - Custom color variables using `hsl(var(--variable))` format
   - Border radius variables
   - Content paths for all component directories

2. **globals.css must define CSS variables**:
   - Complete light/dark theme variables
   - Both `:root` and `.dark` selectors
   - All semantic color tokens (primary, secondary, muted, etc.)

3. **Required shadcn/ui components**:
   ```bash
   npx shadcn-ui@latest add button input card table badge avatar dropdown-menu
   ```

## Architecture Patterns

### Authentication & Authorization
- **4-tier role system**: super_admin → admin → member → viewer
- **Permission-based access control**: Each route/API checks specific permissions
- **Server-side auth**: Use middleware for all protected routes
- **Auth middleware pattern**:
  ```typescript
  // Always check auth first, then permissions
  const user = await requireAuth()
  await requirePermission('users.view')
  ```

### API Design Standards
All API routes must follow this pattern:
```typescript
// 1. Permission check
// 2. Input validation with Zod
// 3. Business logic
// 4. Standardized response format
```

Response format:
```typescript
interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}
```

### Directory Structure
```
app/
├── (auth)/                    # Auth pages (login, register)
├── dashboard/                 # Protected admin pages
│   ├── layout.tsx            # Main dashboard layout with sidebar
│   ├── users/                # User management
│   ├── settings/             # System settings
│   └── profile/              # User profile
├── api/                      # API routes
│   ├── auth/                 # Authentication endpoints
│   ├── users/                # User CRUD operations
│   └── settings/             # Settings endpoints
components/
├── ui/                       # shadcn/ui components
├── dashboard/                # Dashboard-specific components
│   ├── sidebar.tsx           # Navigation with permission filtering
│   ├── header.tsx            # Top navigation
│   └── page-header.tsx       # Standard page header
lib/
├── auth.ts                   # Auth utilities
├── permissions.ts            # Permission definitions
├── auth-middleware.ts        # Server middleware
└── validations/              # Zod schemas
types/
└── auth.ts                   # Auth-related types
```

## Development Workflow

### Implementation Order (Critical)
1. **Phase 1**: Project setup + Tailwind configuration
2. **Phase 2**: Database schema + Supabase setup
3. **Phase 3**: Auth middleware + permission system
4. **Phase 4**: Dashboard layout + navigation
5. **Phase 5**: User management CRUD
6. **Phase 6**: Settings and profile pages

### Key Commands
```bash
# Development
npm run dev

# Build
npm run build

# Type checking (always run before commits)
npm run type-check

# Linting (always run before commits)
npm run lint
```

## UI/UX Standards

### Page Structure Template
Every dashboard page should follow this structure:
```typescript
import { PageHeader } from '@/components/dashboard/page-header'
import { requirePermission } from '@/lib/auth-middleware'

export default async function UsersPage() {
  await requirePermission('users.view')
  
  return (
    <>
      <PageHeader 
        title="User Management"
        description="Manage system users and their permissions"
        action={<CreateButton />}
      />
      <div className="space-y-6">
        {/* Page content */}
      </div>
    </>
  )
}
```

### Component Patterns
- **Permission-aware components**: Filter UI elements based on user permissions
- **Form validation**: Always use Zod schemas with React Hook Form
- **Loading states**: Implement proper loading and error states
- **Mobile responsive**: All components must work on mobile devices

## Security Requirements

### Authentication Flow
1. Supabase handles OAuth and email/password auth
2. Server middleware validates JWT tokens
3. User roles/permissions stored in database
4. Session management via server-side cookies

### Permission Checks
- **Page level**: Every protected page must call `requirePermission()`
- **API level**: Every API route must validate permissions
- **UI level**: Conditionally render based on `hasPermission()`

### Data Validation
- All API inputs validated with Zod schemas
- Server-side validation is authoritative
- Client-side validation for UX only

## Database Considerations

### Multi-tenant Support
The system supports both single and multi-tenant modes via `MULTI_TENANT` env var:
- Single tenant: Direct user management
- Multi-tenant: Organization → Membership → User hierarchy

### Schema Patterns
- Use Prisma for type-safe database operations
- All tables include `created_at` and `updated_at`
- Soft deletes for user data
- Proper indexing on frequently queried fields

## Environment Configuration

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MULTI_TENANT=false
DATABASE_URL=
```

## Testing Strategy

- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- All tests must pass before deployment

## Deployment

Primary target: Cloudflare Workers (recommended)
Alternative: Vercel

The project is designed for serverless deployment with automatic scaling and global edge distribution.

## Development Best Practices

### Code Development Guidelines
- 🔒 Three Fundamental Principles:
  1. Do not modify architecture/dependencies/unrelated files
  2. Do not implement unplanned/redundant functionality
  3. Do not create new files/similar logic unnecessarily

- 🔍 Execution Rules:
  1. Always check existing implementations & file existence before writing code
  2. Decision-making process:
     - Read documentation and project plan
     - Analyze existing code
     - Develop solution
     - Choose the most optimal SOLID approach
     - Execute modifications
  3. Limit changes to current requirement scope

- 🛡️ Defensive Checks:
  - Validation Checklist:
    1. SOLID compliance scan
    2. Technical debt detection → Avoid introducing new debt
  - Golden Verification:
    ✅ SOLID
    ✅ KISS
    ✅ DRY
    ✅ YAGNI
    ✅ LoD (Law of Demeter)

- Post-Implementation Validation:
  1. 100% alignment with documentation: Strictly follow specifications
  2. Incremental verification: Validate after each stage, no bulk completion

### Review Techniques
After completing a module:
1. Compare against PRD requirements, detail implementation status
2. Verify architectural compliance with development guidelines
3. List potential risks and improvement suggestions
4. Provide implementation recommendations for next steps
5. Avoid over-engineering, maintain document alignment

### Mandatory Verification Steps
1. `npm run build` - Check build errors
2. `npm run lint` - Verify code standards
3. Synchronize with GitHub