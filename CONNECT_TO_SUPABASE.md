# 🎯 Supabase Connection Guide - Step by Step

Follow these exact steps to connect your app to Supabase.

---

## 📋 CHECKLIST - Mark Each Step As You Complete It

```
[ ] Step 1: Create Supabase Project
[ ] Step 2: Copy Project URL
[ ] Step 3: Copy Anon Key
[ ] Step 4: Update .env File
[ ] Step 5: Restart Dev Server
[ ] Step 6: Test Signup
[ ] Step 7: Verify User in Dashboard
```

---

## STEP 1: Create Supabase Project

### 1.1 Open Supabase
```
🌐 Go to: https://supabase.com/dashboard
```

### 1.2 Sign Up / Login
- If you don't have an account, create one (free)
- Use Google sign-in for fastest setup

### 1.3 Create New Project
Click the **"New Project"** button

### 1.4 Fill in Project Details
```
Organization: (Select or create one)
Name: treelah-ecommerce
Database Password: [Create a STRONG password - SAVE THIS!]
Region: (Choose closest to you)
  - US: us-east-1
  - Europe: eu-west-3  
  - Asia: ap-southeast-1
Pricing Plan: Free
```

### 1.5 Wait for Setup
- Takes 2-3 minutes
- ☕ Grab a coffee while you wait

**✓ Mark Step 1 complete when you see your project dashboard**

---

## STEP 2: Get Project URL

### 2.1 Navigate to Settings
Click the **⚙️ Settings** icon in the left sidebar

### 2.2 Go to API Section
Click **"API"** in the settings menu

### 2.3 Copy Project URL
Look for **"Project URL"**

It looks like: `https://xyzabc123.supabase.co`

```
👉 COPY THIS URL - You'll need it in Step 4
```

**✓ Mark Step 2 complete when URL is copied**

---

## STEP 3: Get Anon Key

### 3.1 Still on the API Page
Scroll down to **"API Keys"** section

### 3.2 Find the Anon Key
Look for: **"anon public"**

It starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **Important**: Use the `anon` key, NOT the `service_role` key!

```
👉 COPY THIS KEY - You'll need it in Step 4
```

**✓ Mark Step 3 complete when key is copied**

---

## STEP 4: Update .env File

### 4.1 Open Your Project
Open your ecommerce project folder in VS Code

### 4.2 Find .env File
Look for `.env` file in the **root** of your project

If you don't see it:
1. Press `Ctrl+Shift+E` (Windows) or `Cmd+Shift+E` (Mac)
2. Look in the file explorer
3. It should be at the top level, next to `package.json`

### 4.3 Open .env File
Double-click to open it

### 4.4 Replace Placeholders

**BEFORE:**
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**AFTER (with your actual values):**
```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs...
```

### 4.5 Save File
Press `Ctrl+S` (Windows) or `Cmd+S` (Mac)

⚠️ **Common Mistakes to Avoid:**
- ❌ Don't add quotes around the values
- ❌ Don't add extra spaces
- ❌ Don't remove the `VITE_` prefix
- ❌ Make sure there's no space before/after the `=`

**✓ Mark Step 4 complete when .env is updated and saved**

---

## STEP 5: Restart Dev Server

### 5.1 Stop Current Server
If your dev server is running:
- Go to the terminal
- Press `Ctrl+C` to stop it

### 5.2 Start Fresh
```bash
npm run dev
```

### 5.3 Wait for Server to Start
You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**✓ Mark Step 5 complete when server restarts successfully**

---

## STEP 6: Test Signup

### 6.1 Open Browser
Go to: `http://localhost:5173/auth/signup`

### 6.2 Fill in Signup Form
```
Full Name: Test User
Email: test@youremail.com (use a real email)
Phone: +2348012345678
Password: Test@1234
Confirm Password: Test@1234
✓ Check "I agree to Terms..."
```

### 6.3 Click "Create Account"

### 6.4 Check for Success
You should see:
- ✅ "Account created successfully!" toast
- Redirect to home page

If you see an error:
- Check browser console (F12)
- Verify your .env file is correct
- Make sure dev server restarted

**✓ Mark Step 6 complete when signup succeeds**

---

## STEP 7: Verify in Supabase Dashboard

### 7.1 Go Back to Supabase Dashboard
Open: https://supabase.com/dashboard

### 7.2 Select Your Project
Click on your `treelah-ecommerce` project

### 7.3 Navigate to Authentication
Click **🔐 Authentication** in the left sidebar

### 7.4 Check Users Table
Click **"Users"** tab

### 7.5 Verify Your Test User
You should see:
- Your test email
- Created timestamp
- User ID (UUID)

**✓ Mark Step 7 complete when you see your user**

---

## 🎉 SUCCESS!

If you completed all 7 steps, your authentication is **fully working**!

### What You Can Do Now:

1. **Test Login**
   - Go to: `http://localhost:5173/auth/login`
   - Login with your test credentials

2. **Test Logout**
   - Click logout (if you have it in your UI)
   - Session should clear

3. **Check User Persistence**
   - Refresh the page
   - User should stay logged in

4. **View User Data**
   - Use React DevTools
   - Check the AuthContext
   - User metadata should show full name and phone

---

## 🐛 TROUBLESHOOTING

### Problem: "Invalid API key"
**Solution:**
1. Double-check `.env` file
2. Make sure you copied the `anon public` key (not `service_role`)
3. Restart dev server
4. No extra spaces in `.env`

### Problem: "Failed to fetch"
**Solution:**
1. Check internet connection
2. Verify Supabase project is active
3. Check project URL is correct
4. Try accessing project dashboard to ensure it's online

### Problem: User not showing in dashboard
**Solution:**
1. Wait 30 seconds and refresh
2. Click Authentication → Users
3. Check if signup actually succeeded (look for success toast)
4. Check browser console for errors

### Problem: Environment variables not loading
**Solution:**
1. File must be named exactly `.env` (not `.env.txt`)
2. File must be in project root (next to `package.json`)
3. Must restart dev server after changing `.env`
4. Variables must start with `VITE_`

### Problem: "Email not confirmed"
**Solution:**
1. Go to: Authentication → Settings in Supabase
2. Turn OFF "Enable email confirmations" (for development)
3. Click Save
4. Try signup again

---

## 📞 Still Stuck?

Check these resources:

1. **Full Setup Guide**
   - Open: `SUPABASE_SETUP_GUIDE.md`

2. **Usage Examples**
   - Open: `AUTH_USAGE_EXAMPLES.md`

3. **Summary**
   - Open: `AUTH_IMPLEMENTATION_SUMMARY.md`

4. **Supabase Docs**
   - https://supabase.com/docs/guides/auth

5. **Get Help**
   - Supabase Discord: https://discord.supabase.com

---

## 📸 Visual Reference

### Where to Find Your Keys:
```
Supabase Dashboard
└── Your Project
    └── ⚙️ Settings
        └── API
            ├── 📍 Project URL
            │   └── https://xxxxx.supabase.co
            │
            └── 🔑 API Keys
                └── anon public
                    └── eyJhbGciOiJI...
```

### Your .env File Location:
```
ecommerce/
├── .env  ← THIS FILE!
├── package.json
├── src/
├── public/
└── ...
```

---

**You've got this! 💪 Follow each step carefully and you'll be done in 10 minutes.**
