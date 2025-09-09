-- Create HTTM schema
CREATE SCHEMA IF NOT EXISTS httm;

-- Create items table
CREATE TABLE httm.items (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  expiry_days INTEGER,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE httm.recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_items mapping table
CREATE TABLE httm.recipe_items (
  recipe_id INTEGER REFERENCES httm.recipes(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES httm.items(id) ON DELETE CASCADE,
  qty_required INTEGER NOT NULL,
  PRIMARY KEY (recipe_id, item_id)
);

-- Create procurements table
CREATE TABLE httm.procurements (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES httm.items(id) ON DELETE CASCADE,
  qty_requested INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) on all tables
ALTER TABLE httm.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE httm.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE httm.recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE httm.procurements ENABLE ROW LEVEL SECURITY;

-- Create public access policies (since login not required)
CREATE POLICY "Allow all operations on items" ON httm.items FOR ALL USING (true);
CREATE POLICY "Allow all operations on recipes" ON httm.recipes FOR ALL USING (true);
CREATE POLICY "Allow all operations on recipe_items" ON httm.recipe_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on procurements" ON httm.procurements FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION httm.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON httm.items
  FOR EACH ROW EXECUTE FUNCTION httm.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON httm.recipes
  FOR EACH ROW EXECUTE FUNCTION httm.update_updated_at_column();

CREATE TRIGGER update_procurements_updated_at
  BEFORE UPDATE ON httm.procurements
  FOR EACH ROW EXECUTE FUNCTION httm.update_updated_at_column();

-- Insert sample data
INSERT INTO httm.items (code, name, qty, reorder_level, expiry_days, location) VALUES
('ITM001', 'Flour', 100, 20, 365, 'Warehouse A'),
('ITM002', 'Sugar', 50, 10, 730, 'Warehouse A'),
('ITM003', 'Eggs', 30, 5, 7, 'Cold Storage'),
('ITM004', 'Milk', 25, 8, 3, 'Cold Storage'),
('ITM005', 'Butter', 15, 3, 14, 'Cold Storage');

INSERT INTO httm.recipes (name, price) VALUES
('Chocolate Cake', 25.00),
('Vanilla Muffin', 5.00),
('Bread Loaf', 8.50);

INSERT INTO httm.recipe_items (recipe_id, item_id, qty_required) VALUES
(1, 1, 2), -- Chocolate Cake needs 2 Flour
(1, 2, 1), -- Chocolate Cake needs 1 Sugar
(1, 3, 3), -- Chocolate Cake needs 3 Eggs
(2, 1, 1), -- Vanilla Muffin needs 1 Flour
(2, 2, 1), -- Vanilla Muffin needs 1 Sugar
(3, 1, 3), -- Bread Loaf needs 3 Flour
(3, 4, 1); -- Bread Loaf needs 1 Milk