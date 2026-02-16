# AI Development Rules - Martins Class

## Tech Stack
- **React (Vite)**: Core frontend framework for building the single-page application.
- **TypeScript**: Used for all components and logic to ensure type safety and maintainability.
- **Supabase**: Backend-as-a-Service providing PostgreSQL database, Authentication, Storage, and Edge Functions.
- **Tailwind CSS**: Utility-first CSS framework used for all styling and responsive design.
- **shadcn/ui**: Accessible UI component library built on Radix UI primitives.
- **TanStack Query (React Query)**: Handles server state management, caching, and data synchronization.
- **React Router DOM**: Manages client-side routing and navigation.
- **Lucide React**: The primary icon library for the application.
- **React Hook Form & Zod**: Used for robust form handling and schema-based validation.
- **Stripe**: Integrated via Supabase Edge Functions for secure payment processing.

## Library Usage Rules

### Styling & Layout
- **Tailwind CSS**: Always use Tailwind utility classes for styling. Avoid creating custom CSS files or using CSS Modules.
- **Responsive Design**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to ensure the app works on all screen sizes.
- **Theming**: Use the CSS variables defined in `src/index.css` (e.g., `var(--primary)`) which are dynamically updated by the `ThemeApplicator`.

### Components & Icons
- **UI Components**: Always check `src/components/ui/` for existing shadcn components before building new ones.
- **Icons**: Use `lucide-react` for all icons. Keep icon sizes consistent (usually `h-4 w-4` or `h-5 w-5`).
- **Modularity**: Create small, focused components in `src/components/`. Large pages should be broken down into smaller sub-components.

### Data Fetching & State
- **Server State**: Use `@tanstack/react-query` for all API calls to Supabase. Define hooks in `src/hooks/` for reusable queries.
- **Supabase Client**: Always use the client exported from `@/integrations/supabase/client`.
- **Cart State**: Use the `useCart` hook for all shopping cart operations.

### Forms & Validation
- **Forms**: Use `react-hook-form` for managing form state.
- **Validation**: Use `zod` to define schemas for form validation and API payloads.

### Notifications & Feedback
- **Toasts**: Use `sonner` or the shadcn `toast` hook for user notifications (success, error, info).
- **Loading States**: Always provide visual feedback (skeletons or spinners) while data is fetching.

### Backend Logic
- **Edge Functions**: Complex logic like payment processing or admin role assignment must reside in Supabase Edge Functions (`supabase/functions/`).