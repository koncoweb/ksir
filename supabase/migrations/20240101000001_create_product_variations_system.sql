-- Migration: Create Product Variations System
-- Description: Add support for product variations, pricing tiers, and enhanced inventory management

-- 1. Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('warehouse', 'store', 'supplier', 'customer')),
    address TEXT,
    contact_person TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, name)
);

-- 2. Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    variation_name TEXT NOT NULL,
    variation_type TEXT NOT NULL CHECK (variation_type IN ('size', 'flavor', 'color', 'custom')),
    sku TEXT,
    barcode TEXT,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    cost_adjustment DECIMAL(10,2) DEFAULT 0,
    weight DECIMAL(8,3),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, sku),
    UNIQUE(company_id, barcode)
);

-- 3. Create product_pricing table
CREATE TABLE IF NOT EXISTS product_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variation_id UUID REFERENCES product_variations(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    pricing_type TEXT NOT NULL CHECK (pricing_type IN ('retail', 'wholesale', 'member', 'custom')),
    min_quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create stock_movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variation_id UUID REFERENCES product_variations(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'transfer', 'adjustment', 'return')),
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    reference_type TEXT CHECK (reference_type IN ('purchase', 'sale', 'transfer', 'adjustment', 'return')),
    reference_id UUID,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Modify products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_variation_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS base_cost DECIMAL(10,2);

-- Copy existing price/cost to new columns
UPDATE products SET base_price = price WHERE base_price IS NULL;
UPDATE products SET base_cost = cost WHERE base_cost IS NULL;

-- 6. Add location_id to inventory table
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS variation_id UUID REFERENCES product_variations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES locations(id),
ADD COLUMN IF NOT EXISTS reserved_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reorder_point INTEGER,
ADD COLUMN IF NOT EXISTS last_counted_at TIMESTAMP WITH TIME ZONE;

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_variations_product_id ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variations_company_id ON product_variations(company_id);
CREATE INDEX IF NOT EXISTS idx_product_pricing_product_id ON product_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_product_pricing_variation_id ON product_pricing(variation_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_location_id ON stock_movements(location_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_variation_id ON inventory(variation_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location_id ON inventory(location_id);

-- 8. Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE product_variations;
ALTER PUBLICATION supabase_realtime ADD TABLE product_pricing;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_movements;

-- 9. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variations_updated_at BEFORE UPDATE ON product_variations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_pricing_updated_at BEFORE UPDATE ON product_pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
