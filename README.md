# KRD Vault Pro

React/Vite frontend backed by Supabase Database, Auth, Storage, and Edge Functions.

## Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set the project URL and publishable key.
3. Apply `supabase/migrations/20260919000000_initial_schema.sql` with the Supabase CLI or SQL editor.
4. Deploy both functions:

```bash
supabase functions deploy verify-download-code --no-verify-jwt
supabase functions deploy download-system-file --no-verify-jwt
```

5. Sign up the administrator, then run the commented `update public.profiles` statement at the bottom of the migration with the administrator's email.
6. For Google login, enable Google under Authentication > Providers and add the deployed site URL to Authentication > URL Configuration.
7. Install and run the app:

```bash
npm install
npm run dev
```

## Data migration

Export the existing records as JSON or CSV, then import them into the matching plural tables. Upload public images to `public-assets`, upload downloadable packages to `system-files`, and store each private object's path in `systems.system_file_uri`. User passwords cannot normally be exported from a managed authentication provider; invite users or ask them to reset their passwords in Supabase Auth.

Never put the secret key or service-role key in a `VITE_` variable. The browser only needs the publishable key.
