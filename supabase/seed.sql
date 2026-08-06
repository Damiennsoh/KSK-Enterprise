
-- ============================================================
-- KSK Enterprise - Seed Data
-- Run this after migrations to populate the database
-- ============================================================

-- ─── PRODUCTS (Fashion / Smocks) ────────────────────────────
INSERT INTO products (name, description, price, category, sizes, colors, images, stock) VALUES
('Traditional Fugu Smock', 'Hand-woven traditional smock made by skilled artisans in the Upper West Region. Features intricate geometric patterns and comfortable fit.', 350.00, 'Smocks', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White/Black', 'Blue/White', 'Red/Black', 'Green/Yellow'], ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800'], 25),

('Premium Wedding Fugu', 'Elegant hand-woven smock perfect for weddings and special occasions. Made with premium cotton threads.', 550.00, 'Smocks', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['White/Gold', 'Cream/Brown', 'Navy/Silver'], ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'], 15),

('Casual Everyday Smock', 'Lightweight and breathable smock for daily wear. Comfortable for all-day use in the Ghanaian climate.', 180.00, 'Smocks', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Beige', 'Light Blue', 'Grey'], ARRAY['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800'], 40),

('Children Traditional Smock', 'Adorable mini smocks for children. Available in various sizes for ages 3-12.', 120.00, 'Smocks', ARRAY['XS', 'S', 'M'], ARRAY['White/Blue', 'Red/Yellow', 'Green/White'], ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'], 20),

('Executive Corporate Smock', 'Modern interpretation of the traditional smock, suitable for corporate and formal settings.', 420.00, 'Smocks', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Black/White', 'Navy/Gold', 'Charcoal/Silver'], ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800'], 12),

('Hand-Woven Kente Scarf', 'Beautiful Kente scarf to complement your smock. Made with authentic kente patterns.', 85.00, 'Accessories', ARRAY['One Size'], ARRAY['Multi-color', 'Gold/Green', 'Red/Black'], ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'], 30);

-- ─── VEHICLES (Car Rentals) ──────────────────────────────────
INSERT INTO vehicles (name, model, brand, seats, price_per_day, deposit, images, description, is_available) VALUES
('Toyota Camry', '2020', 'Toyota', 5, 450.00, 500.00, ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'Reliable and comfortable sedan perfect for personal use and small family trips. Well-maintained with AC and modern features.', true),

('Hyundai Elantra', '2019', 'Hyundai', 5, 380.00, 400.00, ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'], 'Fuel-efficient sedan ideal for city driving and short trips. Clean interior and smooth ride.', true),

('Toyota Land Cruiser Prado', '2018', 'Toyota', 7, 800.00, 1000.00, ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=800'], 'Spacious SUV perfect for family trips, events, and rough terrain. Premium comfort with 7 seats.', true),

('Mercedes-Benz C-Class', '2021', 'Mercedes-Benz', 5, 700.00, 800.00, ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'], 'Luxury sedan for weddings and special occasions. Elegant design with premium leather interior.', true),

('Kia Sportage', '2020', 'Kia', 5, 500.00, 600.00, ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'], 'Compact SUV with excellent fuel economy. Great for both city driving and highway trips.', true),

('Toyota Hiace Bus', '2019', 'Toyota', 15, 1200.00, 1500.00, ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'], 'Spacious van for group transportation, weddings, and corporate events. Seats up to 15 passengers.', true);

-- ─── MATERIALS (Construction) ────────────────────────────────
INSERT INTO materials (name, description, price, unit, stock, images, category) VALUES
('Portland Cement (Dangote)', 'High-quality Dangote Portland cement for all construction needs. 50kg bag.', 85.00, 'bag', 500, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Cement'),

('Portland Cement (GHACEM)', 'Premium GHACEM Portland cement. Strong and reliable for building foundations and walls.', 88.00, 'bag', 450, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Cement'),

('Concrete Blocks (6-inch)', 'Solid 6-inch concrete blocks for wall construction. Durable and uniform.', 6.50, 'block', 2000, ARRAY['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'], 'Blocks'),

('Concrete Blocks (9-inch)', 'Heavy-duty 9-inch concrete blocks for load-bearing walls and foundations.', 9.00, 'block', 1500, ARRAY['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'], 'Blocks'),

('Iron Rods (12mm)', 'High-tensile 12mm iron rods for reinforcement. Standard length 12 meters.', 85.00, 'rod', 300, ARRAY['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800'], 'Steel'),

('Iron Rods (16mm)', 'High-tensile 16mm iron rods for heavy reinforcement work. Standard length 12 meters.', 140.00, 'rod', 250, ARRAY['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800'], 'Steel'),

('Iron Rods (8mm)', 'Standard 8mm iron rods for light reinforcement and binding. Standard length 12 meters.', 45.00, 'rod', 400, ARRAY['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800'], 'Steel'),

('Roofing Sheets (Aluzinc)', 'Durable Aluzinc roofing sheets. Corrosion-resistant and long-lasting. Price per meter.', 45.00, 'meter', 1000, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Roofing'),

('Roofing Sheets (IBR)', 'IBR profile roofing sheets. Modern design with excellent water drainage. Price per meter.', 55.00, 'meter', 800, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Roofing'),

('Sand (Tipper Load)', 'Clean river sand delivered by tipper truck. Approximately 15 cubic meters per load.', 1200.00, 'tipper', 50, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Aggregate'),

('Chippings (Tipper Load)', 'Crushed stone chippings for concrete mixing and road construction. 15 cubic meters per load.', 1400.00, 'tipper', 40, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Aggregate'),

('Binding Wire', 'Galvanized binding wire for tying reinforcement bars. 20kg roll.', 180.00, 'roll', 80, ARRAY['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800'], 'Steel'),

('Nails (4-inch)', 'Standard 4-inch nails for general carpentry and construction. 25kg bag.', 120.00, 'bag', 100, ARRAY['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800'], 'Hardware'),

('Timber (2x4 Planks)', 'Treated 2x4 timber planks for roofing and framing. Price per piece.', 35.00, 'piece', 500, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Timber'),

('Timber (2x6 Planks)', 'Treated 2x6 timber planks for heavy-duty framing. Price per piece.', 55.00, 'piece', 300, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Timber'),

('Paint (Emulsion - 20L)', 'Premium emulsion paint for interior walls. 20-liter bucket. Various colors available.', 280.00, 'bucket', 60, ARRAY['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800'], 'Paint'),

('Paint (Weatherguard - 20L)', 'Weather-resistant exterior paint. Protects against rain and sun damage. 20-liter bucket.', 320.00, 'bucket', 50, ARRAY['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800'], 'Paint'),

('Tiles (Floor - 40x40cm)', 'Ceramic floor tiles. 40x40cm. Box of 12 pieces covers 1.92 sqm.', 95.00, 'box', 200, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Tiles'),

('Tiles (Wall - 30x60cm)', 'Glossy wall tiles. 30x60cm. Box of 8 pieces covers 1.44 sqm.', 85.00, 'box', 180, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Tiles'),

('PVC Pipes (4-inch)', 'High-quality 4-inch PVC pipes for drainage and plumbing. Price per 6-meter length.', 65.00, 'length', 150, ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], 'Plumbing');
