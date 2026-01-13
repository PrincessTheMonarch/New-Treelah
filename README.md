# Gifted & Co. E-commerce Platform

A modern gift-focused e-commerce platform built with React, TypeScript, and Tailwind CSS.

## Project Overview

Gifted & Co. is a comprehensive e-commerce platform designed for gift shopping. The platform provides a seamless shopping experience with features like product discovery, secure checkout, and payment processing.

### Main Features Implemented

- **User Authentication**: Email/password signup and login with session persistence
- **Product Discovery**: Browse and search for gifts with detailed product pages
- **Shopping Cart**: Add/remove items and manage cart state globally
- **Secure Checkout**: Multi-step checkout process with authentication
- **Payment Integration**: Paystack payment processing (test mode)
- **Responsive UI**: Mobile-friendly design across all pages

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **Payments**: Paystack API
- **State Management**: React Context API
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account
- Paystack account (for payment processing)

### Installation

```bash
# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variable Setup

1. Copy `.env.example` to `.env`
2. Replace all placeholder values in `.env` with your actual credentials
3. Ensure all required environment variables are set (see Environment Variables section)

## Environment Variables

The following environment variables are required for the application to function:

### Supabase Configuration

- `VITE_SUPABASE_URL`: Your Supabase project URL
  - **Used in**: [`src/lib/supabase.ts`](src/lib/supabase.ts:3), [`src/vite-env.d.ts`](src/vite-env.d.ts:4)
  - **Purpose**: Connects to your Supabase backend services

- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous API key
  - **Used in**: [`src/lib/supabase.ts`](src/lib/supabase.ts:4), [`src/vite-env.d.ts`](src/vite-env.d.ts:5)
  - **Purpose**: Provides public access to Supabase database and authentication

### Paystack Configuration

- `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack public key (test or live)
  - **Used in**: [`src/lib/paystack.ts`](src/lib/paystack.ts:124), [`src/hooks/usePaystackPayment.ts`](src/hooks/usePaystackPayment.ts:149)
  - **Purpose**: Initializes Paystack payment popup in the frontend

- `PAYSTACK_SECRET_KEY`: Your Paystack secret key (used in Edge Functions)
  - **Used in**: [`supabase/functions/verify-payment/index.ts`](supabase/functions/verify-payment/index.ts:121)
  - **Purpose**: Verifies payments server-side (never exposed to frontend)

### Optional Configuration

- `VITE_APP_NAME`: Application name (default: "Gifted & Co.")
- `VITE_APP_URL`: Application base URL (default: "http://localhost:3000")

**Important Security Notes**:

- Never expose `PAYSTACK_SECRET_KEY` in frontend code
- Only use public keys in client-side applications
- Secret keys should only be used in secure server environments

## Current Status

### Completed Features

- User authentication (signup, login, session persistence)
- Product discovery and browsing
- Shopping cart functionality
- Secure checkout process
- Paystack payment integration (test mode)
- Responsive UI design

### Partially Completed Features

- Order management (UI exists, backend integration needed)
- Payment verification (Edge Function implemented, and tested)
- User profiles (basic structure in place)

### Remaining Features

- Admin dashboard for product management
- Order history and tracking (order history has been implemented.  Tracking is what is left)
- Email verification for user accounts
- Password reset functionality
- OAuth providers (Google, Facebook login)
- Production deployment configuration

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and libraries
├── pages/            # Application pages
└── data/             # Mock data and types

supabase/
├── functions/        # Edge Functions (payment verification)
└── schema.sql        # Database schema

public/              # Static assets
```

## Notes

- The platform is designed for easy extension and customization
- Core flows (authentication, cart, checkout, payments) are fully implemented
- Admin features can be added without major refactoring
- The current implementation uses test mode for Paystack payments

## Handover Checklist
- [x] Environment variables use placeholder values
- [x] Clear documentation for setup and configuration
- [x] Project structure documented
- [x] Current status and remaining features documented
- [x] Security best practices documented

## Next Steps for New Developers

1. Set up your development environment
2. Configure environment variables with your own credentials
3. Test the authentication flow
4. Verify Paystack payment integration with test keys
5. Begin implementing remaining features as needed
