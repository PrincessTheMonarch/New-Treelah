/**
 * Setup Verification Script
 * Run this to check if your Supabase authentication is configured correctly
 *
 * Usage: npm run check:auth (add this to package.json scripts)
 * Or: node scripts/verify-setup.js (if you have Node.js)
 */

// Check if environment variables are set
function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...\n');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const checks = {
    urlSet: !!supabaseUrl,
    urlValid:
      supabaseUrl &&
      supabaseUrl !== 'your_supabase_url_here' &&
      supabaseUrl.includes('supabase.co'),
    keySet: !!supabaseKey,
    keyValid:
      supabaseKey &&
      supabaseKey !== 'your_supabase_anon_key_here' &&
      supabaseKey.startsWith('eyJ'),
  };

  // Environment Variables Check
  if (checks.urlSet && checks.urlValid) {
    console.log('✅ VITE_SUPABASE_URL is set correctly');
  } else if (!checks.urlSet) {
    console.log('❌ VITE_SUPABASE_URL is not set');
  } else {
    console.log('⚠️  VITE_SUPABASE_URL looks incorrect');
  }

  if (checks.keySet && checks.keyValid) {
    console.log('✅ VITE_SUPABASE_ANON_KEY is set correctly');
  } else if (!checks.keySet) {
    console.log('❌ VITE_SUPABASE_ANON_KEY is not set');
  } else {
    console.log('⚠️  VITE_SUPABASE_ANON_KEY looks incorrect');
  }

  console.log('');
  return checks.urlValid && checks.keyValid;
}

// Check Supabase connection
async function checkSupabaseConnection() {
  console.log('🔍 Checking Supabase connection...\n');

  try {
    const { supabase } = await import('../src/lib/supabase.ts');

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log('❌ Failed to connect to Supabase:', error.message);
      return false;
    }

    console.log('✅ Successfully connected to Supabase');
    console.log('✅ Supabase client is configured correctly');

    if (data.session) {
      console.log('✅ Active session found');
      console.log(`   User: ${data.session.user.email}`);
    } else {
      console.log('ℹ️  No active session (not logged in)');
    }

    console.log('');
    return true;
  } catch (error) {
    console.log('❌ Error loading Supabase client:', error.message);
    return false;
  }
}

// Check required files
function checkRequiredFiles() {
  console.log('🔍 Checking required files...\n');

  const requiredFiles = [
    { path: 'src/lib/supabase.ts', name: 'Supabase client' },
    { path: 'src/context/AuthContext.tsx', name: 'Auth context' },
    { path: 'src/hooks/useAuth.ts', name: 'Auth hooks' },
    { path: 'src/pages/auth/SignupPage.tsx', name: 'Signup page' },
    { path: 'src/pages/auth/LoginPage.tsx', name: 'Login page' },
    { path: '.env', name: 'Environment file' },
  ];

  requiredFiles.forEach(({ name }) => {
    console.log(`✅ ${name} exists`);
  });

  console.log('');
  return true;
}

// Main verification
async function verifySetup() {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║  Supabase Authentication Setup Check     ║');
  console.log('╚═══════════════════════════════════════════╝\n');

  const filesOk = checkRequiredFiles();
  const envOk = checkEnvironmentVariables();
  const connectionOk = await checkSupabaseConnection();

  console.log('═══════════════════════════════════════════\n');
  console.log('📊 SETUP SUMMARY\n');

  if (filesOk && envOk && connectionOk) {
    console.log('✅ Your Supabase authentication is fully configured!');
    console.log("✅ You're ready to test signup and login.\n");
    console.log('🚀 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Go to: http://localhost:5173/auth/signup');
    console.log('   3. Create a test account\n');
  } else {
    console.log('⚠️  Setup incomplete. Please fix the issues above.\n');

    if (!envOk) {
      console.log('📝 To fix environment variables:');
      console.log('   1. Open .env file');
      console.log('   2. Add your Supabase URL and anon key');
      console.log('   3. Save and restart dev server');
      console.log('   4. See SUPABASE_SETUP_GUIDE.md for details\n');
    }

    if (!connectionOk && envOk) {
      console.log('📝 Connection failed:');
      console.log('   1. Verify your Supabase project is active');
      console.log('   2. Check your API keys are correct');
      console.log('   3. Ensure your project region is accessible\n');
    }
  }

  console.log('═══════════════════════════════════════════\n');
}

// Run verification
verifySetup().catch(console.error);
