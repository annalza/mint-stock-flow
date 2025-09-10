-- Fix security warnings by updating existing functions without dropping
CREATE OR REPLACE FUNCTION httm.generate_item_code()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = httm, public
AS $$
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
$$;

-- Fix the update function security as well
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;