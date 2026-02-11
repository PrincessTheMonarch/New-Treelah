# Supabase Authentication Setup Guide

This guide will walk you through setting up Supabase authentication for your Treelah e-commerce application.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js installed on your machine
- This project cloned/downloaded locally

## 🚀 Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the project details:
   - **Project Name**: `treelah-ecommerce` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
   - **Pricing Plan**: Start with the Free tier
4. Click **"Create new project"**
5. Wait 2-3 minutes for your project to be set up

## 🔑 Step 2: Get Your API Keys

1. Once your project is ready, go to **Settings** (gear icon on the left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Copy both values - you'll need them in the next step

## 📝 Step 3: Configure Environment Variables

1. Open the `.env` file in your project root (it was just created)
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

3. Save the file
4. **IMPORTANT**: Never commit the `.env` file to Git. It's already in `.gitignore`

## 🗄️ Step 4: Set Up Database Tables (Optional but Recommended)

To store additional user profile information like phone numbers, create a profiles table:

1. In your Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click **"New Query"**
3. Copy and paste the following SQL:

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policy: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Create policy: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create policy: Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone_number)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Click **"Run"** or press `Ctrl/Cmd + Enter`
5. You should see "Success. No rows returned"

## 📧 Step 5: Configure Email Settings

### For Development (Email Confirmation Disabled)
1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Scroll to **Email Auth**
3. **Toggle OFF** "Enable email confirmations"
4. Click **Save**

This allows users to sign in immediately without confirming their email (good for development).

### For Production (Email Confirmation Enabled - Recommended)
1. Keep "Enable email confirmations" **ON**
2. Configure a custom SMTP provider:
   - Go to **Settings** > **Authentication**
   - Scroll to **SMTP Settings**
   - Configure your email provider (Gmail, SendGrid, etc.)
3. Customize email templates:
   - Go to **Authentication** > **Email Templates**
   - Edit the confirmation, password reset, and magic link templates

## 🎨 Step 6: Customize Auth Settings (Optional)

### Change Site URL (Important for Production)
1. Go to **Authentication** > **Settings**
2. Change **Site URL** to your production domain (e.g., `https://treelah.com`)
3. Add **Redirect URLs** for allowed callback URLs

### Password Requirements
1. In **Authentication** > **Settings**
2. Scroll to **Password Requirements**
3. Current setting: Minimum 8 characters (your app enforces more strict rules in the frontend)

### Disable Sign-ups (If Needed)
1. In **Authentication** > **Settings**
2. Toggle **"Enable sign ups"** OFF to prevent new registrations

## 🧪 Step 7: Test Your Authentication

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the signup page: `http://localhost:5173/auth/signup`

3. Create a test account:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+2348012345678`
   - Password: `Test@1234` (meets all requirements)

4. Check if the signup was successful:
   - Go to **Authentication** > **Users** in Supabase dashboard
   - You should see your test user listed

5. Test login:
   - Navigate to `/auth/login`
   - Sign in with the credentials you just created

## 🔐 Authentication Features Already Implemented

Your app already has these features working:

✅ **Email/Password Signup** with:
- Full name and phone number collection
- Strong password validation (8+ chars, uppercase, lowercase, number, special char)
- Terms of service agreement
- Automatic user metadata storage

✅ **Email/Password Login** with:
- Remember me option
- Password visibility toggle
- Error handling

✅ **Protected Routes**
- Automatic redirect to login for unauthenticated users
- State preservation for intended destination after login

✅ **Session Management**
- Automatic session persistence
- Auto-refresh of tokens
- Session detection in URL (for email confirmations)

## 🔧 Troubleshooting

### Issue: "Invalid API key" or "Project not found"
- Double-check your `.env` file has the correct URL and key
- Make sure you've restarted your dev server after adding env variables
- Verify the keys are from the **API** section, not the service_role key

### Issue: Users can't sign up
- Check if "Enable sign ups" is ON in Authentication settings
- Verify email confirmation is OFF for development
- Check the browser console for detailed error messages

### Issue: Users don't show up in the database
- Make sure you ran the SQL in Step 4
- Check the **Authentication** > **Users** tab (they should appear here)
- Check the **Table Editor** > **profiles** for the profile data

### Issue: Environment variables not loading
- Ensure the file is named exactly `.env` (not `.env.local` or `.env.txt`)
- Restart your development server (`Ctrl+C` and `npm run dev`)
- Verify the variables start with `VITE_` prefix

## 🚀 Next Steps

Now that authentication is set up, you can:

1. **Add Password Reset**: Implement a forgot password flow
2. **Add Social Login**: Enable Google, GitHub, or other OAuth providers
3. **Add User Profiles**: Create a profile page to edit user information
4. **Add Email Verification**: Enable email confirmations in production
5. **Test Edge Cases**: Try invalid emails, weak passwords, etc.

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/auth-signup)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Need Help?

- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)

---

**Happy coding! 🎉**
