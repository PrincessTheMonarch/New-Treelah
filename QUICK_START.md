# Quick Start: Supabase Authentication Setup

## ✅ Checklist

### 1. Install Dependencies (Already Done ✓)
- `@supabase/supabase-js` is already installed
- All UI components are ready

### 2. Create Supabase Project
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Name: `treelah-ecommerce`
- [ ] Choose region closest to your users
- [ ] Wait 2-3 minutes for setup

### 3. Get API Credentials
- [ ] Go to Settings > API
- [ ] Copy "Project URL" 
- [ ] Copy "anon public" key

### 4. Configure Environment Variables
- [ ] Open `.env` file in project root
- [ ] Paste your Supabase URL
- [ ] Paste your Supabase anon key
- [ ] Save the file

### 5. Set Up Database (Optional but Recommended)
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Run the SQL from `SUPABASE_SETUP_GUIDE.md` (Step 4)
- [ ] This creates a profiles table for user data

### 6. Configure Email Settings
For development:
- [ ] Go to Authentication > Settings
- [ ] Turn OFF "Enable email confirmations"
- [ ] Click Save

### 7. Test Authentication
- [ ] Run `npm run dev`
- [ ] Go to `/auth/signup`
- [ ] Create a test account
- [ ] Check Supabase dashboard > Authentication > Users

## 🎯 What's Already Working

Your authentication is fully implemented with:

✅ **Sign Up Page** (`/auth/signup`)
- Email & password
- Full name & phone number
- Strong password validation
- Terms acceptance

✅ **Login Page** (`/auth/login`)
- Email & password
- Remember me
- Password visibility toggle

✅ **Auth Context**
- Session management
- Auto token refresh
- Protected routes

✅ **User Flow**
- Automatic redirect after login
- State preservation
- Error handling

## 📝 Your Current Files

### `.env` (Configure this!)
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### `src/lib/supabase.ts` ✓
- Supabase client configured
- Session persistence enabled

### `src/context/AuthContext.tsx` ✓
- Sign up with email, password, name, phone
- Sign in with email & password  
- Sign out
- Session management

### `src/pages/auth/SignupPage.tsx` ✓
- Beautiful UI
- Form validation
- Password strength checker

### `src/pages/auth/LoginPage.tsx` ✓
- Clean interface
- Error handling
- Remember me option

## 🚀 Test It Out

Run these commands:

```bash
# Start development server
npm run dev

# Open browser to:
http://localhost:5173/auth/signup
```

Create a test user and check your Supabase dashboard!

## 🔗 Important Links

- 📖 [Full Setup Guide](./SUPABASE_SETUP_GUIDE.md)
- 🌐 [Supabase Dashboard](https://supabase.com/dashboard)
- 📚 [Supabase Docs](https://supabase.com/docs/guides/auth)

## 🆘 Common Issues

**Problem**: Environment variables not loading
**Solution**: Restart dev server after editing `.env`

**Problem**: Can't create users
**Solution**: Check "Enable sign ups" is ON in Supabase Auth settings

**Problem**: Invalid API key
**Solution**: Make sure you copied the "anon public" key, not the secret key

---

Need help? Check the [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for detailed instructions!
