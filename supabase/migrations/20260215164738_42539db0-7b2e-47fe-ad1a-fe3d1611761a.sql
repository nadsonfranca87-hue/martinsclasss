
-- App role enum and user_roles table FIRST
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- has_role function BEFORE any policies that use it
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Styles table
CREATE TABLE public.styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Styles are viewable by everyone" ON public.styles FOR SELECT USING (true);
CREATE POLICY "Admins can manage styles" ON public.styles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are viewable by everyone" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins can manage brands" ON public.brands FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  style_id UUID REFERENCES public.styles(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  is_new BOOLEAN DEFAULT false,
  is_promo BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Product images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site settings table
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders can be created by anyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('product-videos', 'product-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

CREATE POLICY "Public read for assets" ON storage.objects FOR SELECT USING (bucket_id IN ('product-images', 'product-videos', 'site-assets'));
CREATE POLICY "Admin upload assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('product-images', 'product-videos', 'site-assets') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('product-images', 'product-videos', 'site-assets') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('product-images', 'product-videos', 'site-assets') AND public.has_role(auth.uid(), 'admin'));

-- Insert default data
INSERT INTO public.categories (name, sort_order) VALUES ('Roupas', 1), ('Acessórios', 2), ('Novidades', 3);
INSERT INTO public.styles (name, sort_order) VALUES ('Casual', 1), ('Street', 2), ('Urbano', 3), ('Clássico', 4);
INSERT INTO public.brands (name, sort_order) VALUES ('Martins Class', 1);

INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'Martins Class'),
  ('hero_title', 'Martins Class'),
  ('hero_subtitle', 'Nova Coleção 2026'),
  ('hero_description', 'Elegância atemporal para quem busca peças únicas. Roupas que contam histórias e definem estilos.'),
  ('about_title', 'Moda com propósito e elegância'),
  ('about_text1', 'A Martins Class nasceu da paixão por criar peças que transcendem tendências.'),
  ('about_text2', 'Cada peça da nossa coleção é cuidadosamente selecionada, priorizando materiais sustentáveis.'),
  ('contact_email', 'contato@martinsclass.com.br'),
  ('contact_phone', '+55 11 9999-0000'),
  ('contact_address', 'Rua Oscar Freire, 123 — São Paulo, SP'),
  ('whatsapp_link', 'https://wa.me/5511999990000'),
  ('whatsapp_number', '5511999990000'),
  ('instagram_link', 'https://instagram.com/martinsclass'),
  ('footer_text', '© 2026 Martins Class. Todos os direitos reservados.');
