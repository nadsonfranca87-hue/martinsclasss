
-- Drop and recreate all RLS policies as PERMISSIVE

-- site_settings
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- products
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- product_images
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON public.product_images;
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);

-- categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- styles
DROP POLICY IF EXISTS "Admins can manage styles" ON public.styles;
DROP POLICY IF EXISTS "Styles are viewable by everyone" ON public.styles;
CREATE POLICY "Admins can manage styles" ON public.styles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Styles are viewable by everyone" ON public.styles FOR SELECT USING (true);

-- brands
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON public.brands;
CREATE POLICY "Admins can manage brands" ON public.brands FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Brands are viewable by everyone" ON public.brands FOR SELECT USING (true);

-- orders
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view orders" ON public.orders;
DROP POLICY IF EXISTS "Orders can be created by anyone" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Orders can be created by anyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders viewable by admins" ON public.orders FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
