
-- Create shipping_zones table for CEP-based shipping rates
CREATE TABLE public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cep_start text NOT NULL,
  cep_end text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  estimated_days integer NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shipping zones viewable by everyone" ON public.shipping_zones FOR SELECT USING (true);
CREATE POLICY "Admins can manage shipping zones" ON public.shipping_zones FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert some default zones
INSERT INTO public.shipping_zones (name, cep_start, cep_end, price, estimated_days) VALUES
  ('São Paulo Capital', '01000000', '09999999', 12.90, 3),
  ('São Paulo Interior', '10000000', '19999999', 18.90, 5),
  ('Rio de Janeiro', '20000000', '28999999', 22.90, 6),
  ('Minas Gerais', '30000000', '39999999', 25.90, 7),
  ('Sul', '80000000', '89999999', 28.90, 8),
  ('Nordeste', '40000000', '65999999', 32.90, 10),
  ('Norte', '66000000', '69999999', 38.90, 12);
