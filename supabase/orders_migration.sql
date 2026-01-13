-- ============================================================================
-- ORDERS SYSTEM MIGRATION FOR SUPABASE
-- Copy and paste this entire file into your Supabase SQL Editor
-- ============================================================================

-- Step 0: Drop triggers first (they depend on functions)
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;


-- Step 1: Drop functions (CASCADE to remove dependencies)
-- ============================================================================
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_profile_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS public.create_order_from_payment(
  UUID, UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) CASCADE;


-- Step 2: Create profiles table if it doesn't exist (needed for RLS)
-- ============================================================================
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

-- Profiles RLS - drop existing policies first
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS '
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>''full_name'', '''')
  );
  RETURN NEW;
END;
' LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile updated_at trigger
CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER AS '
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_updated_at();


-- Step 3: Create the update_updated_at_column function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS '
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
' LANGUAGE plpgsql;


-- Step 4: Create the CART ITEMS table
-- ============================================================================
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

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- Cart RLS policies
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Service role can manage cart items" ON public.cart_items;

CREATE POLICY "Users can insert their own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cart items" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage cart items" ON public.cart_items
  FOR ALL USING (auth.role() = 'service_role');

-- Cart trigger
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Step 5: Create the ORDERS table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID,
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

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);


-- Step 6: Create the ORDER ITEMS table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT,
  unit_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  personalization TEXT,
  gift_wrap BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);


-- Step 7: Order RLS policies
-- ============================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users cannot insert orders directly" ON public.orders;
DROP POLICY IF EXISTS "Users cannot update orders directly" ON public.orders;
DROP POLICY IF EXISTS "Users cannot delete orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update order status" ON public.orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users cannot insert orders directly" ON public.orders
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Users cannot update orders directly" ON public.orders
  FOR UPDATE USING (false);

CREATE POLICY "Users cannot delete orders" ON public.orders
  FOR DELETE USING (false);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update order status" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');


-- Step 8: Order Items RLS policies
-- ============================================================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users cannot insert order items directly" ON public.order_items;
DROP POLICY IF EXISTS "Users cannot update order items" ON public.order_items;
DROP POLICY IF EXISTS "Users cannot delete order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Service role can manage order items" ON public.order_items;

CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users cannot insert order items directly" ON public.order_items
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Users cannot update order items" ON public.order_items
  FOR UPDATE USING (false);

CREATE POLICY "Users cannot delete order items" ON public.order_items
  FOR DELETE USING (false);

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      JOIN public.orders ON orders.user_id = profiles.id
      WHERE orders.id = order_items.order_id
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can manage order items" ON public.order_items
  FOR ALL USING (auth.role() = 'service_role');


-- Step 9: Order trigger
-- ============================================================================
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Step 10: Order number generation function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS '
DECLARE
  new_order_number TEXT;
  is_unique BOOLEAN := false;
  random_digits TEXT;
BEGIN
  WHILE NOT is_unique LOOP
    random_digits := array_to_string(
      (SELECT array_agg(digit) FROM generate_series(1, 7) AS s(digit) WHERE digit = floor(random() * 10)::INT),
      ''''
    );
    new_order_number := ''I'' || random_digits;
    
    IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_order_number) THEN
      is_unique := true;
    END IF;
  END LOOP;
  
  RETURN new_order_number;
END;
' LANGUAGE plpgsql;


-- Step 11: Create order function (called by verify-payment)
-- ============================================================================
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
RETURNS JSON AS '
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal NUMERIC := 0;
  v_total NUMERIC := 0;
  v_cart_item RECORD;
  v_order_item_id UUID;
BEGIN
  v_order_number := public.generate_order_number();
  
  SELECT COALESCE(SUM(unit_price * quantity), 0) INTO v_subtotal
  FROM public.cart_items
  WHERE user_id = p_user_id;
  
  v_total := v_subtotal + p_delivery_fee;
  
  INSERT INTO public.orders (
    order_number, user_id, payment_id, status,
    subtotal_amount, delivery_fee, total_amount,
    shipping_name, shipping_phone, shipping_address,
    shipping_city, shipping_state, shipping_country,
    shipping_postal_code, notes
  ) VALUES (
    v_order_number, p_user_id, p_payment_id, ''processing'',
    v_subtotal, p_delivery_fee, v_total,
    p_shipping_name, p_shipping_phone, p_shipping_address,
    p_shipping_city, p_shipping_state, p_shipping_country,
    p_shipping_postal_code, p_notes
  )
  RETURNING id INTO v_order_id;
  
  FOR v_cart_item IN 
    SELECT * FROM public.cart_items WHERE user_id = p_user_id
  LOOP
    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_category,
      unit_price, quantity, total_price, personalization, gift_wrap
    ) VALUES (
      v_order_id, v_cart_item.product_id, v_cart_item.product_name, v_cart_item.product_category,
      v_cart_item.unit_price, v_cart_item.quantity, v_cart_item.unit_price * v_cart_item.quantity,
      v_cart_item.personalization, v_cart_item.gift_wrap
    )
    RETURNING id INTO v_order_item_id;
    
    DELETE FROM public.cart_items WHERE id = v_cart_item.id;
  END LOOP;
  
  RETURN json_build_object(
    ''order_id'', v_order_id,
    ''order_number'', v_order_number,
    ''subtotal'', v_subtotal,
    ''delivery_fee'', p_delivery_fee,
    ''total'', v_total
  );
END;
' LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- VERIFICATION: Check if everything was created
-- ============================================================================
SELECT 'Tables created:' as status, COUNT(*) as count FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('profiles', 'cart_items', 'orders', 'order_items');

SELECT 'Functions created:' as status, COUNT(*) as count FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name IN ('handle_new_user', 'update_profile_updated_at', 'update_updated_at_column', 'generate_order_number', 'create_order_from_payment');

SELECT 'Order function test:' as status, public.generate_order_number() as test_order_number;
