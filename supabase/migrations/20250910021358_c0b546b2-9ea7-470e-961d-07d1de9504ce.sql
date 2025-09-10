-- Make item code unique and auto-generated
ALTER TABLE httm.items 
DROP CONSTRAINT IF EXISTS items_code_unique;

ALTER TABLE httm.items 
ADD CONSTRAINT items_code_unique UNIQUE (code);

-- Create function to auto-generate item codes
CREATE OR REPLACE FUNCTION httm.generate_item_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_code := 'ITM' || LPAD(counter::TEXT, 3, '0');
        
        -- Check if code already exists
        IF NOT EXISTS (SELECT 1 FROM httm.items WHERE code = new_code) THEN
            RETURN new_code;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update items table to auto-generate codes for new items
ALTER TABLE httm.items 
ALTER COLUMN code SET DEFAULT httm.generate_item_code();

-- Add status column to procurement table for admin approval
ALTER TABLE httm.procurements 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add approved_by and approved_at columns
ALTER TABLE httm.procurements 
ADD COLUMN IF NOT EXISTS approved_by TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;