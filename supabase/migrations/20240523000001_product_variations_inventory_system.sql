-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  sku VARCHAR,
  barcode VARCHAR,
  price NUMERIC NOT NULL,
  wholesale_price NUMERIC,
  min_wholesale_qty INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add publication for realtime
alter publication supabase_realtime add table product_variations;

-- Modify inventory table to reference product_variations instead of products
ALTER TABLE inventory ADD COLUMN variation_id UUID REFERENCES product_variations(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variations_product_id ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variation_id ON inventory(variation_id);

-- Add inventory_transactions table to track stock movements
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variation_id UUID REFERENCES product_variations(id),
  location_name VARCHAR NOT NULL,
  location_type VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  transaction_type VARCHAR NOT NULL,
  reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add publication for realtime
alter publication supabase_realtime add table inventory_transactions;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_variation_id ON inventory_transactions(variation_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_company_id ON inventory_transactions(company_id);
