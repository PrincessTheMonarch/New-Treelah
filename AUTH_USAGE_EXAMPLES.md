# Authentication Usage Examples

This document shows you how to use authentication in your components.

## 🔐 Getting User Information

### Basic Usage - Get Current User

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.user_metadata?.full_name}!</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.user_metadata?.phone_number}</p>
    </div>
  );
}
```

### User Object Structure

```tsx
user = {
  id: "uuid-string",
  email: "user@example.com",
  user_metadata: {
    full_name: "John Doe",
    phone_number: "+2348012345678"
  },
  created_at: "2024-01-15T10:30:00Z",
  // ... other fields
}
```

## 🛡️ Protecting Routes

### Method 1: Using useRequireAuth Hook (Recommended)

```tsx
import { useRequireAuth } from '../hooks/useAuth';

function ProtectedPage() {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // User is guaranteed to be authenticated here
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only logged-in users can see this</p>
    </div>
  );
}
```

### Method 2: Manual Check

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Profile page content</div>;
}
```

## 🚪 Sign Out

```tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (!user) return null;

  return (
    <header>
      <span>Welcome, {user.user_metadata?.full_name}</span>
      <button onClick={handleSignOut}>Sign Out</button>
    </header>
  );
}
```

## 🔄 Redirect Authenticated Users

For login/signup pages - redirect if already logged in:

```tsx
import { useRedirectIfAuthenticated } from '../hooks/useAuth';

function LoginPage() {
  const { loading } = useRedirectIfAuthenticated('/dashboard');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form>
      {/* Login form */}
    </form>
  );
}
```

## 📝 Conditional Rendering Based on Auth

### Show Different Content for Logged In/Out Users

```tsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Navigation() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <nav>
      <Link to="/">Home</Link>
      
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/orders">My Orders</Link>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

## 🛒 Use in Cart/Checkout

```tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function CheckoutButton() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCheckout = () => {
    if (!user) {
      // Save current page, redirect to login
      navigate('/auth/login', { 
        state: { from: location.pathname }
      });
      return;
    }

    // User is authenticated, proceed to checkout
    navigate('/checkout');
  };

  return (
    <button onClick={handleCheckout}>
      {user ? 'Proceed to Checkout' : 'Login to Checkout'}
    </button>
  );
}
```

## 🔍 Check User Role/Permissions

If you add role-based access:

```tsx
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { user } = useAuth();

  // Check if user has admin role (stored in metadata)
  const isAdmin = user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return <div>Admin panel content</div>;
}
```

## 📱 Display User Avatar

```tsx
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

function UserAvatar() {
  const { user } = useAuth();

  if (!user) return null;

  // Get initials from full name
  const initials = user.user_metadata?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <Avatar>
      <AvatarImage src={user.user_metadata?.avatar_url} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
```

## 🔔 Show Welcome Message on Login

```tsx
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name?.split(' ')[0] || 'there';
      toast.success(`Welcome back, ${name}!`);
    }
  }, [user?.id]); // Only trigger when user ID changes

  return <div>{/* App content */}</div>;
}
```

## 🧪 Testing Authentication State

```tsx
import { useAuth } from '../context/AuthContext';

function DebugAuth() {
  const { user, loading } = useAuth();

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'white', padding: 10 }}>
      <h4>Auth Debug</h4>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Authenticated: {user ? 'Yes' : 'No'}</p>
      {user && (
        <>
          <p>User ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Name: {user.user_metadata?.full_name}</p>
        </>
      )}
    </div>
  );
}
```

## 💾 Access User in Non-React Code

If you need to check auth outside React components:

```typescript
import { supabase } from '../lib/supabase';

// Get current session
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Example usage in a utility function
export async function fetchUserOrders() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id);

  return data;
}
```

## 🎯 Best Practices

1. **Always check loading state** before rendering auth-dependent content
2. **Use hooks for consistency** - prefer `useAuth()` over direct Supabase calls in components
3. **Handle errors gracefully** - show user-friendly messages
4. **Preserve navigation state** - use `location.state.from` for redirects
5. **Don't expose sensitive data** - never log user tokens or passwords

## 🔗 Related Files

- Auth Context: `src/context/AuthContext.tsx`
- Auth Hooks: `src/hooks/useAuth.ts`
- Supabase Client: `src/lib/supabase.ts`
- Login Page: `src/pages/auth/LoginPage.tsx`
- Signup Page: `src/pages/auth/SignupPage.tsx`
