-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  logo_url TEXT,
  subscription_plan VARCHAR(50) DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add company_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- Create products table with company_id
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  sku VARCHAR(100),
  barcode VARCHAR(100),
  category_id UUID,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table with company_id
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table with company_id
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('warehouse', 'store')),
  location_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table with company_id
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  transaction_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update the handle_new_user function to support company assignment
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, company_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    (NEW.raw_user_meta_data->>'company_id')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies table
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
CREATE POLICY "Users can view their own company"
ON companies FOR SELECT
USING (
  id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Company admins can update their company" ON companies;
CREATE POLICY "Company admins can update their company"
ON companies FOR UPDATE
USING (
  id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'pemilik')
  )
);

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view users in their company" ON users;
CREATE POLICY "Users can view users in their company"
ON users FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage users in their company" ON users;
CREATE POLICY "Admins can manage users in their company"
ON users FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'pemilik')
  )
);

-- RLS Policies for products table
DROP POLICY IF EXISTS "Users can view products in their company" ON products;
CREATE POLICY "Users can view products in their company"
ON products FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage products in their company" ON products;
CREATE POLICY "Users can manage products in their company"
ON products FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- RLS Policies for categories table
DROP POLICY IF EXISTS "Users can view categories in their company" ON categories;
CREATE POLICY "Users can view categories in their company"
ON categories FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage categories in their company" ON categories;
CREATE POLICY "Users can manage categories in their company"
ON categories FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- RLS Policies for inventory table
DROP POLICY IF EXISTS "Users can view inventory in their company" ON inventory;
CREATE POLICY "Users can view inventory in their company"
ON inventory FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage inventory in their company" ON inventory;
CREATE POLICY "Users can manage inventory in their company"
ON inventory FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- RLS Policies for transactions table
DROP POLICY IF EXISTS "Users can view transactions in their company" ON transactions;
CREATE POLICY "Users can view transactions in their company"
ON transactions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage transactions in their company" ON transactions;
CREATE POLICY "Users can manage transactions in their company"
ON transactions FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- RLS Policies for transaction_items table
DROP POLICY IF EXISTS "Users can view transaction items in their company" ON transaction_items;
CREATE POLICY "Users can view transaction items in their company"
ON transaction_items FOR SELECT
USING (
  transaction_id IN (
    SELECT id FROM transactions 
    WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Users can manage transaction items in their company" ON transaction_items;
CREATE POLICY "Users can manage transaction items in their company"
ON transaction_items FOR ALL
USING (
  transaction_id IN (
    SELECT id FROM transactions 
    WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE companies;

-- Handle users table realtime publication safely
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime DROP TABLE users;
    EXCEPTION
        WHEN undefined_object THEN
            -- Table is not in publication, continue
            NULL;
    END;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE transaction_items;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_categories_company_id ON categories(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_company_id ON inventory(company_id);
CREATE INDEX IF NOT EXISTS idx_transactions_company_id ON transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_product_id ON transaction_items(product_id);

-- Insert sample company for testing
INSERT INTO companies (name, slug, address, phone, email) 
VALUES ('Demo Company', 'demo-company', 'Jl. Demo No. 123, Jakarta', '+62 21 1234567', 'demo@company.com')
ON CONFLICT (slug) DO NOTHING;