-- Gifted & Co. Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- This table stores additional user profile information
-- It is automatically created when users sign up via Supabase Auth

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGER FUNCTION
-- ============================================
-- Automatically create a profile row when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER
-- ============================================
-- Execute the function after user creation

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Ensure users can only access their own profile

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- INDEXES
-- ============================================
-- Performance optimization

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
-- Auto-update the updated_at column

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PAYMENTS TABLE
-- ============================================
-- Stores Paystack payment records for order tracking and verification

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID, -- Nullable for now, can be linked to orders table later
  reference TEXT UNIQUE NOT NULL, -- Paystack payment reference
  amount INTEGER NOT NULL, -- Amount in kobo (Nigerian kobo, not US cents)
  currency TEXT DEFAULT 'NGN' NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  provider TEXT DEFAULT 'paystack' NOT NULL,
  paid_at TIMESTAMPTZ, -- When payment was confirmed successful
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS INDEXES
-- ============================================
-- Performance optimization for payment queries

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

-- ============================================
-- PAYMENTS ROW LEVEL SECURITY (RLS)
-- ============================================
-- Secure payment data access - users can only see their own payments

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can INSERT their own payment records
CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can SELECT only their own payment records
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Prevent users from updating or deleting payments (security)
CREATE POLICY "Users cannot update payments" ON public.payments
  FOR UPDATE USING (false);

CREATE POLICY "Users cannot delete payments" ON public.payments
  FOR DELETE USING (false);

-- Admin users can read all payments (for support/admin purposes)
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Service role can manage all payments (for Edge Functions)
CREATE POLICY "Service role can manage payments" ON public.payments
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- PAYMENTS TRIGGERS
-- ============================================
-- Auto-update the updated_at column for payments

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- CART TABLE
-- ============================================
-- Stores cart items for users - persists across sessions

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT,
  unit_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  personalization TEXT,
  gift_wrap BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CART INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- ============================================
-- CART ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can INSERT their own cart items
CREATE POLICY "Users can insert their own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can SELECT only their own cart items
CREATE POLICY "Users can view their own cart items" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can UPDATE their own cart items
CREATE POLICY "Users can update their own cart items" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can DELETE their own cart items
CREATE POLICY "Users can delete their own cart items" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Service role can manage all cart items
CREATE POLICY "Service role can manage cart items" ON public.cart_items
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- CART TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ORDERS TABLE
-- ============================================
-- Stores order records for order tracking and history

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order ID (e.g., I1245678)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE RESTRICT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'in_transit', 'delivered', 'canceled')),
  subtotal_amount NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN' NOT NULL,
  shipping_name TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_country TEXT,
  shipping_postal_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
-- Stores individual items within an order

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL, -- Stored for history integrity
  product_category TEXT,
  unit_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  personalization TEXT,
  gift_wrap BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ============================================
-- ORDERS ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can SELECT only their own orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Prevent users from directly inserting orders from client
CREATE POLICY "Users cannot insert orders directly" ON public.orders
  FOR INSERT USING (false);

-- Prevent users from updating orders directly
CREATE POLICY "Users cannot update orders directly" ON public.orders
  FOR UPDATE USING (false);

-- Prevent users from deleting orders
CREATE POLICY "Users cannot delete orders" ON public.orders
  FOR DELETE USING (false);

-- Admin users can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin users can update order status
CREATE POLICY "Admins can update order status" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Service role can manage all orders
CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- ORDER ITEMS ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can SELECT only their own order items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Prevent users from directly inserting order items
CREATE POLICY "Users cannot insert order items directly" ON public.order_items
  FOR INSERT USING (false);

-- Prevent users from updating order items
CREATE POLICY "Users cannot update order items" ON public.order_items
  FOR UPDATE USING (false);

-- Prevent users from deleting order items
CREATE POLICY "Users cannot delete order items" ON public.order_items
  FOR DELETE USING (false);

-- Admin users can view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      JOIN public.orders ON orders.user_id = profiles.id
      WHERE orders.id = order_items.order_id
      AND profiles.role = 'admin'
    )
  );

-- Service role can manage all order items
CREATE POLICY "Service role can manage order items" ON public.order_items
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- ORDERS TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ORDER NUMBER GENERATION FUNCTION
-- ============================================
-- Generates a unique human-friendly order number
-- Format: I + random 7 digits (e.g., I1245678)

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $
DECLARE
  new_order_number TEXT;
  is_unique BOOLEAN := false;
  random_digits TEXT;
BEGIN
  -- Keep generating until we find a unique number
  WHILE NOT is_unique LOOP
    random_digits := array_to_string(
      (SELECT array_agg(digit) FROM generate_series(1, 7) AS s(digit) WHERE digit = floor(random() * 10)::INT),
      ''
    );
    new_order_number := 'I' || random_digits;
    
    -- Check if this order number already exists
    IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_order_number) THEN
      is_unique := true;
    END IF;
  END LOOP;
  
  RETURN new_order_number;
END;
$ LANGUAGE plpgsql;

-- ============================================
-- CREATE ORDER FUNCTION (for use in Edge Functions)
-- ============================================
-- Creates an order with items atomically after successful payment
-- This function is called by the verify-payment Edge Function

CREATE OR REPLACE FUNCTION public.create_order_from_payment(
  p_user_id UUID,
  p_payment_id UUID,
  p_delivery_fee NUMERIC DEFAULT 0,
  p_shipping_name TEXT DEFAULT NULL,
  p_shipping_phone TEXT DEFAULT NULL,
  p_shipping_address TEXT DEFAULT NULL,
  p_shipping_city TEXT DEFAULT NULL,
  p_shipping_state TEXT DEFAULT NULL,
  p_shipping_country TEXT DEFAULT NULL,
  p_shipping_postal_code TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal NUMERIC := 0;
  v_total NUMERIC := 0;
  v_cart_item RECORD;
  v_order_item_id UUID;
BEGIN
  -- Generate order number
  v_order_number := public.generate_order_number();
  
  -- Calculate subtotal from cart items
  SELECT COALESCE(SUM(unit_price * quantity), 0) INTO v_subtotal
  FROM public.cart_items
  WHERE user_id = p_user_id;
  
  -- Calculate total
  v_total := v_subtotal + p_delivery_fee;
  
  -- Create order record
  INSERT INTO public.orders (
    order_number,
    user_id,
    payment_id,
    status,
    subtotal_amount,
    delivery_fee,
    total_amount,
    shipping_name,
    shipping_phone,
    shipping_address,
    shipping_city,
    shipping_state,
    shipping_country,
    shipping_postal_code,
    notes
  ) VALUES (
    v_order_number,
    p_user_id,
    p_payment_id,
    'processing',
    v_subtotal,
    p_delivery_fee,
    v_total,
    p_shipping_name,
    p_shipping_phone,
    p_shipping_address,
    p_shipping_city,
    p_shipping_state,
    p_shipping_country,
    p_shipping_postal_code,
    p_notes
  )
  RETURNING id INTO v_order_id;
  
  -- Move cart items to order items and clear cart
  FOR v_cart_item IN 
    SELECT * FROM public.cart_items WHERE user_id = p_user_id
  LOOP
    -- Insert order item
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_category,
      unit_price,
      quantity,
      total_price,
      personalization,
      gift_wrap
    ) VALUES (
      v_order_id,
      v_cart_item.product_id,
      v_cart_item.product_name,
      v_cart_item.product_category,
      v_cart_item.unit_price,
      v_cart_item.quantity,
      v_cart_item.unit_price * v_cart_item.quantity,
      v_cart_item.personalization,
      v_cart_item.gift_wrap
    )
    RETURNING id INTO v_order_item_id;
    
    -- Delete cart item
    DELETE FROM public.cart_items WHERE id = v_cart_item.id;
  END LOOP;
  
  -- Return order details
  RETURN json_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'delivery_fee', p_delivery_fee,
    'total', v_total
  );
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UPDATE PAYMENT TO LINK ORDER
-- ============================================
-- Updates a payment record to link it to an order

CREATE OR REPLACE FUNCTION public.link_payment_to_order(
  p_payment_id UUID,
  p_order_id UUID
)
RETURNS VOID AS $
BEGIN
  UPDATE public.payments
  SET order_id = p_order_id
  WHERE id = p_payment_id;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
--
