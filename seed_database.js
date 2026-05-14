const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seed() {
  console.log('Starting enriched celebrity-inspired database seeding...');

  // 1. Categories
  const categoriesData = [
    { name: 'Formal', slug: 'formal', description: 'Elegant evening and business formal wear', image_url: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=1000' },
    { name: 'Casual', slug: 'casual', description: 'Relaxed, luxurious everyday styles', image_url: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000' },
    { name: 'Party', slug: 'party', description: 'Glamorous outfits for special celebrations', image_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000' },
    { name: 'Traditional', slug: 'traditional', description: 'Rich cultural craftsmanship and festive ensembles', image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000' }
  ];

  console.log('Upserting categories...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .upsert(categoriesData, { onConflict: 'slug' })
    .select();

  if (catError) {
    console.error('Error seeding categories:', catError);
    return;
  }
  console.log('Categories seeded successfully:', categories.map(c => c.name));

  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // 2. Products Data - Enriched with celebrity/real-world luxury reference styling
  const productsData = [
    // Formal Category
    { name: 'Velour Tailored Blazer', description: 'Premium structured velour blazer with gold accents.', price: 180, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000', category_id: catMap['formal'], size_options: ['S', 'M', 'L', 'XL'], color_options: ['Midnight Black', 'Imperial Blue'], gender: 'Unisex', in_stock: true },
    { name: 'Silk Charmeuse Trousers', description: 'High-waisted wide leg trousers in pure silk.', price: 119, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000', category_id: catMap['formal'], size_options: ['S', 'M', 'L'], color_options: ['Midnight Black'], gender: 'Unisex', in_stock: true },
    { name: 'Obsidian Collarless Wool Coat', description: 'Architectural full-length tailored topcoat in premium virgin wool.', price: 340, discount_percentage: 10, image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000', category_id: catMap['formal'], size_options: ['38R', '40R', '42R', '44R'], color_options: ['Obsidian Black'], gender: 'Male', in_stock: true },
    { name: 'Pleated Tapered Dress Pants', description: 'Modern single-pleat structured trousers with a refined taper.', price: 145, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000', category_id: catMap['formal'], size_options: ['30', '32', '34', '36'], color_options: ['Obsidian Black', 'Charcoal'], gender: 'Male', in_stock: true },
    { name: 'Polished Chelsea Leather Boots', description: 'Sleek wholecut premium leather boots with robust elastic gussets.', price: 210, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000', category_id: catMap['formal'], size_options: ['8', '9', '10', '11', '12'], color_options: ['Polished Black'], gender: 'Male', in_stock: true },
    { name: 'Pure Cashmere Fine-Knit Polo', description: 'Ultra-soft fully-fashioned long sleeve polo knit from 100% Grade-A cashmere.', price: 225, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000', category_id: catMap['formal'], size_options: ['S', 'M', 'L', 'XL'], color_options: ['Cream', 'Heather Grey'], gender: 'Male', in_stock: true },
    { name: 'High-Rise Charcoal Wool Trousers', description: 'Impeccable high-waisted fluid trousers featuring deep double pleats.', price: 160, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000', category_id: catMap['formal'], size_options: ['30', '32', '34'], color_options: ['Charcoal Grey'], gender: 'Male', in_stock: true },

    // Casual Category
    { name: 'Linen Artisan Tunic', description: 'Breathable longline tunic woven from organic premium linen.', price: 89, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000', category_id: catMap['casual'], size_options: ['XS', 'S', 'M', 'L'], color_options: ['Ivory White', 'Desert Sage'], gender: 'Unisex', in_stock: true },
    { name: 'Classic Suede Loafers', description: 'Handcrafted unlined suede loafers for superior comfort.', price: 110, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000', category_id: catMap['casual'], size_options: ['8', '9', '10', '11'], color_options: ['Sand', 'Chestnut'], gender: 'Unisex', in_stock: true },
    { name: 'Chunky Lurex Thread Knit Cardigan', description: 'Vintage-inspired thick knit cardigan infused with shimmering multi-tonal metallic threads.', price: 175, discount_percentage: 15, image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000', category_id: catMap['casual'], size_options: ['S', 'M', 'L'], color_options: ['Metallic Sunset', 'Cosmic Blue'], gender: 'Unisex', in_stock: true },
    { name: 'Flared Camel Corduroy Trousers', description: 'Flattering retro wide-leg pants crafted from plush pure cotton corduroy.', price: 115, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000', category_id: catMap['casual'], size_options: ['28', '30', '32', '34'], color_options: ['Rich Camel'], gender: 'Unisex', in_stock: true },
    { name: 'Vintage Distressed Leather Trench Coat', description: 'Matrix-inspired tailored leather overcoat featuring beautifully achieved multi-year patination.', price: 420, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000', category_id: catMap['casual'], size_options: ['XS', 'S', 'M', 'L'], color_options: ['Worn Black', 'Espresso'], gender: 'Female', in_stock: true },
    { name: 'Parachute Technical Cargo Pants', description: 'Adjustable ultra-lightweight voluminous utility pants with polished hardware toggle ends.', price: 130, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000', category_id: catMap['casual'], size_options: ['XS', 'S', 'M'], color_options: ['Slate Grey', 'Olive Drab'], gender: 'Female', in_stock: true },
    { name: 'Frameless Chromatic Shield Sunglasses', description: 'Futuristic hyper-curved aesthetic protective lenses with iridescent multi-layer mirror finishes.', price: 85, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000', category_id: catMap['casual'], size_options: ['One Size'], color_options: ['Silver Iridescent'], gender: 'Female', in_stock: true },
    { name: 'Oversized Double-Breasted Wool Blazer', description: 'Daring proportion-play streetwear top layer crafted from resilient heavy twill wool.', price: 260, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000', category_id: catMap['casual'], size_options: ['M', 'L', 'XL'], color_options: ['Houndstooth', 'Midnight'], gender: 'Male', in_stock: true },
    { name: 'Heavyweight Graphic Terry Hoodie', description: 'Thick pre-shrunk vintage wash French terry item with ambient tonal front branding.', price: 120, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000', category_id: catMap['casual'], size_options: ['S', 'M', 'L', 'XL'], color_options: ['Vintage Black', 'Washed Violet'], gender: 'Male', in_stock: true },

    // Party Category
    { name: 'Aura Sequined Gown', description: 'Floor-sweeping mesh gown adorned with reflective micropieces.', price: 249, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000', category_id: catMap['party'], size_options: ['XS', 'S', 'M'], color_options: ['Rose Gold', 'Obsidian'], gender: 'Female', in_stock: true },
    { name: 'Chandelier Crystal Cascade Earrings', description: 'Dangling cascade statement pieces with authentic cut glass.', price: 100, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000', category_id: catMap['party'], size_options: ['One Size'], color_options: ['Gold/Clear'], gender: 'Female', in_stock: true },
    { name: 'Chrome Silk-Blend Cropped Blazer', description: 'Futuristic hyper-reflective liquid metallic woven micro-top structure.', price: 195, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000', category_id: catMap['party'], size_options: ['XS', 'S', 'M'], color_options: ['Liquid Chrome'], gender: 'Female', in_stock: true },
    { name: 'Sculpted Metallic Trousers', description: 'High-shine coated technical trousers precision tailored for dynamic movement.', price: 165, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000', category_id: catMap['party'], size_options: ['XS', 'S', 'M', 'L'], color_options: ['Liquid Chrome'], gender: 'Female', in_stock: true },
    { name: 'Crimson Satin Opera Cape Gown', description: 'Extravagant dramatic volume trailing floor silk gown featuring full off-shoulder caping.', price: 450, discount_percentage: 20, image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000', category_id: catMap['party'], size_options: ['XS', 'S', 'M'], color_options: ['Imperial Crimson'], gender: 'Female', in_stock: true },
    { name: 'Layered Freshwater Pearl Choker', description: 'Five tiers of naturally cultured luminous grade AAA asymmetric pearls clamped by gold clasping.', price: 140, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000', category_id: catMap['party'], size_options: ['One Size'], color_options: ['Natural Ivory'], gender: 'Female', in_stock: true },
    { name: 'Liquid Holographic Chainmail Mini Dress', description: 'Mesmerizing custom-linked metallic mesh discs engineered to catch and disperse targeted strobe lighting.', price: 290, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000', category_id: catMap['party'], size_options: ['XS', 'S', 'M'], color_options: ['Iridescent Silver'], gender: 'Female', in_stock: true },
    { name: 'Metallic Silver Knee-High Boots', description: 'Stiletto shaft footwear featuring high impact full mirror leather finishing.', price: 240, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000', category_id: catMap['party'], size_options: ['6', '7', '8', '9', '10'], color_options: ['Mirror Silver'], gender: 'Female', in_stock: true },

    // Traditional Category
    { name: 'Zari Brocade Silk Sherwani / Ensemble', description: 'Intricate classic golden threadwork sherwani over layered pure fabric.', price: 120, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', category_id: catMap['traditional'], size_options: ['M', 'L', 'XL'], color_options: ['Royal Crimson', 'Cream Gold'], gender: 'Male', in_stock: true },
    { name: 'Handloom Tussar Trousers', description: 'Sleek traditional base legwear complementing rich festive sets.', price: 59, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', category_id: catMap['traditional'], size_options: ['M', 'L', 'XL'], color_options: ['Cream Gold'], gender: 'Male', in_stock: true },
    { name: 'Handwoven Banarasi Crimson Saree', description: 'Heirloom level pure silk canvas carrying meticulously hand-passed fine golden pure zari jacquard detailing.', price: 380, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', category_id: catMap['traditional'], size_options: ['Standard Drape'], color_options: ['Regal Crimson'], gender: 'Female', in_stock: true },
    { name: 'Gold-Plated Kundan Choker Set', description: 'Traditional multi-gem embedded statement royal ensemble base handcrafted by traditional master artisans.', price: 180, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000', category_id: catMap['traditional'], size_options: ['Adjustable'], color_options: ['Antique Gold'], gender: 'Female', in_stock: true },
    { name: 'Midnight Velvet Embroidered Sherwani', description: 'Heavyweight royal deep pile custom tailored velvet adorned with brilliant silver crystal threading motifs.', price: 290, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000', category_id: catMap['traditional'], size_options: ['S', 'M', 'L', 'XL'], color_options: ['Midnight Navy'], gender: 'Male', in_stock: true },
    { name: 'Flared Angrakha Layered Kurta', description: 'Asymmetric sweeping crossover soft raw silk under-robe providing superb visual kinetic sway.', price: 110, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', category_id: catMap['traditional'], size_options: ['S', 'M', 'L', 'XL'], color_options: ['Pristine Cream'], gender: 'Male', in_stock: true }
  ];

  console.log('Clearing existing relational dependencies to guarantee a clean seeding pass...');
  // Clear optional dependent tables to gracefully avoid ForeignKey blockages
  await supabase.from('favorites').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('look_reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('look_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('looks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Inserting products...');
  const { data: products, error: prodError } = await supabase
    .from('products')
    .insert(productsData)
    .select();

  if (prodError) {
    console.error('Error seeding products:', prodError);
    return;
  }
  console.log('Products seeded successfully:', products.length);

  const prodMap = {};
  products.forEach(p => { prodMap[p.name] = p.id; });

  // 3. Looks Data - 10 Gorgeous Celebrity Inspired Multi-Product Premium Looks
  const looksData = [
    { name: 'evening-elegance', title: 'Evening Elegance', description: 'A tailored masterpiece statement defining absolute luxury for formal galas.', category_id: catMap['formal'], model_image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000', background_color: '#1A1A1A', gender: 'Unisex', featured: true },
    { name: 'casual-chic', title: 'Casual Chic', description: 'Laid back opulence utilizing pure unlined soft components for fluid daily aesthetics.', category_id: catMap['casual'], model_image_url: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000', background_color: '#F5F5F0', gender: 'Unisex', featured: true },
    { name: 'party-glamour', title: 'Party Glamour', description: 'Command the attention of the entire room with shimmering ambient interaction elements.', category_id: catMap['party'], model_image_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000', background_color: '#2A1B2C', gender: 'Female', featured: true },
    { name: 'weekend-vibe', title: 'Weekend Vibe', description: 'Traditional festive prestige woven closely with golden threads of generational heritage.', category_id: catMap['traditional'], model_image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', background_color: '#3B2A20', gender: 'Male', featured: true },
    
    // Brand new celebrity-inspired styling masterpieces
    { name: 'metallic-euphoria', title: 'Metallic Euphoria', description: 'Inspired by Zendaya. A show-stopping futuristic hyper-reflective liquid chrome ensemble tailored for elite nightlife command.', category_id: catMap['party'], model_image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000', background_color: '#1E1B1E', gender: 'Female', featured: true },
    { name: 'dune-avant-garde', title: 'Dune Avant-Garde', description: 'Inspired by Timothée Chalamet. Sharp architectural monochromatic tailoring with pristine structure and uncompromised clean lines.', category_id: catMap['formal'], model_image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000', background_color: '#121212', gender: 'Male', featured: true },
    { name: 'sovereign-opulence', title: 'Sovereign Opulence', description: 'Inspired by Rihanna. A masterclass in breathtaking haute couture volumes, dramatic trailing trains, and cascading natural luminosity.', category_id: catMap['party'], model_image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000', background_color: '#2B1214', gender: 'Female', featured: true },
    { name: 'eclectic-nostalgia', title: 'Eclectic Nostalgia', description: 'Inspired by Harry Styles. Fluid 70s rock nostalgia flawlessly intersecting with plush corduroy fabrics and cosmic micro-sequins.', category_id: catMap['casual'], model_image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000', background_color: '#2D2820', gender: 'Unisex', featured: true },
    { name: 'cyber-matrix-trench', title: 'Cyber Matrix Trench', description: 'Inspired by Bella Hadid. Subversive high-street sophistication anchoring around a full length heavy patinated leather icon layer.', category_id: catMap['casual'], model_image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000', background_color: '#181A1B', gender: 'Female', featured: true },
    { name: 'quiet-luxury-silhouette', title: 'Quiet Luxury Silhouette', description: 'Inspired by Jacob Elordi. Flawless effortless proportioning anchored by hyper-premium pure spun fibers and meticulous high tapers.', category_id: catMap['formal'], model_image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000', background_color: '#1F2224', gender: 'Male', featured: true },
    { name: 'studio-54-revival', title: 'Studio 54 Revival', description: 'Inspired by Dua Lipa. Pure hedonistic flash utilizing ultra high mirror plating components designed to disperse ambient strobe lighting.', category_id: catMap['party'], model_image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000', background_color: '#221B2C', gender: 'Female', featured: true },
    { name: 'imperial-velvet-brocade', title: 'Imperial Velvet Brocade', description: 'Inspired by Ranveer Singh. An unapologetically regal fusion of heavy midnight textures, flowing silken inner layers, and royal legacy cuts.', category_id: catMap['traditional'], model_image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', background_color: '#161B26', gender: 'Male', featured: true }
  ];

  console.log('Inserting looks...');
  const { data: looks, error: lookError } = await supabase
    .from('looks')
    .insert(looksData)
    .select();

  if (lookError) {
    console.error('Error seeding looks:', lookError);
    return;
  }
  console.log('Looks seeded successfully:', looks.map(l => l.title));

  const lookMap = {};
  looks.forEach(l => { lookMap[l.name] = l.id; });

  // 4. Look Items Mapping - Fully detailing every single combined item per outfit
  const lookItemsData = [
    // Evening Elegance
    { look_id: lookMap['evening-elegance'], product_id: prodMap['Velour Tailored Blazer'], position: 'top', label: 'Primary Attire' },
    { look_id: lookMap['evening-elegance'], product_id: prodMap['Silk Charmeuse Trousers'], position: 'bottom', label: 'Legwear Base' },

    // Casual Chic
    { look_id: lookMap['casual-chic'], product_id: prodMap['Linen Artisan Tunic'], position: 'top', label: 'Core Top' },
    { look_id: lookMap['casual-chic'], product_id: prodMap['Classic Suede Loafers'], position: 'footwear', label: 'Premium Footwear' },

    // Party Glamour
    { look_id: lookMap['party-glamour'], product_id: prodMap['Aura Sequined Gown'], position: 'full_body', label: 'Statement Gown' },
    { look_id: lookMap['party-glamour'], product_id: prodMap['Chandelier Crystal Cascade Earrings'], position: 'accessory', label: 'Accent Piece' },

    // Weekend Vibe
    { look_id: lookMap['weekend-vibe'], product_id: prodMap['Zari Brocade Silk Sherwani / Ensemble'], position: 'top', label: 'Heritage Upper' },
    { look_id: lookMap['weekend-vibe'], product_id: prodMap['Handloom Tussar Trousers'], position: 'bottom', label: 'Traditional Lower' },

    // Metallic Euphoria (Zendaya)
    { look_id: lookMap['metallic-euphoria'], product_id: prodMap['Chrome Silk-Blend Cropped Blazer'], position: 'top', label: 'Liquid Outer' },
    { look_id: lookMap['metallic-euphoria'], product_id: prodMap['Sculpted Metallic Trousers'], position: 'bottom', label: 'Reflective Trousers' },
    { look_id: lookMap['metallic-euphoria'], product_id: prodMap['Chandelier Crystal Cascade Earrings'], position: 'accessory', label: 'Diamond Cascade' },

    // Dune Avant-Garde (Timothée)
    { look_id: lookMap['dune-avant-garde'], product_id: prodMap['Obsidian Collarless Wool Coat'], position: 'top', label: 'Architectural Topcoat' },
    { look_id: lookMap['dune-avant-garde'], product_id: prodMap['Pleated Tapered Dress Pants'], position: 'bottom', label: 'Single Pleat Lower' },
    { look_id: lookMap['dune-avant-garde'], product_id: prodMap['Polished Chelsea Leather Boots'], position: 'footwear', label: 'Wholecut Leather Boot' },

    // Sovereign Opulence (Rihanna)
    { look_id: lookMap['sovereign-opulence'], product_id: prodMap['Crimson Satin Opera Cape Gown'], position: 'full_body', label: 'Trailing Silk Gown' },
    { look_id: lookMap['sovereign-opulence'], product_id: prodMap['Layered Freshwater Pearl Choker'], position: 'accessory', label: 'Five-Tier Pearls' },

    // Eclectic Nostalgia (Harry Styles)
    { look_id: lookMap['eclectic-nostalgia'], product_id: prodMap['Chunky Lurex Thread Knit Cardigan'], position: 'top', label: 'Shimmering Outer Knit' },
    { look_id: lookMap['eclectic-nostalgia'], product_id: prodMap['Flared Camel Corduroy Trousers'], position: 'bottom', label: 'Wide-Leg Retro Base' },

    // Cyber Matrix Trench (Bella Hadid)
    { look_id: lookMap['cyber-matrix-trench'], product_id: prodMap['Vintage Distressed Leather Trench Coat'], position: 'top', label: 'Icon Patinated Trench' },
    { look_id: lookMap['cyber-matrix-trench'], product_id: prodMap['Parachute Technical Cargo Pants'], position: 'bottom', label: 'Voluminous Lower' },
    { look_id: lookMap['cyber-matrix-trench'], product_id: prodMap['Frameless Chromatic Shield Sunglasses'], position: 'accessory', label: 'Shield Vision Optics' },

    // Quiet Luxury Silhouette (Jacob Elordi)
    { look_id: lookMap['quiet-luxury-silhouette'], product_id: prodMap['Pure Cashmere Fine-Knit Polo'], position: 'top', label: 'Grade-A Cashmere Core' },
    { look_id: lookMap['quiet-luxury-silhouette'], product_id: prodMap['High-Rise Charcoal Wool Trousers'], position: 'bottom', label: 'Double Pleated Trouser' },
    { look_id: lookMap['quiet-luxury-silhouette'], product_id: prodMap['Polished Chelsea Leather Boots'], position: 'footwear', label: 'Minimalist Boot' },

    // Studio 54 Revival (Dua Lipa)
    { look_id: lookMap['studio-54-revival'], product_id: prodMap['Liquid Holographic Chainmail Mini Dress'], position: 'full_body', label: 'Prismatic Mesh Mini' },
    { look_id: lookMap['studio-54-revival'], product_id: prodMap['Metallic Silver Knee-High Boots'], position: 'footwear', label: 'Stiletto Shaft Boots' },

    // Imperial Velvet Brocade (Ranveer Singh)
    { look_id: lookMap['imperial-velvet-brocade'], product_id: prodMap['Midnight Velvet Embroidered Sherwani'], position: 'outer', label: 'Deep Pile Royal Upper' },
    { look_id: lookMap['imperial-velvet-brocade'], product_id: prodMap['Flared Angrakha Layered Kurta'], position: 'top', label: 'Kinetic Sway Under-Robe' },
    { look_id: lookMap['imperial-velvet-brocade'], product_id: prodMap['Handloom Tussar Trousers'], position: 'bottom', label: 'Sleek Base Trousers' }
  ];

  console.log('Inserting look items...');
  const { data: lookItems, error: itemsError } = await supabase
    .from('look_items')
    .insert(lookItemsData)
    .select();

  if (itemsError) {
    console.error('Error seeding look items:', itemsError);
    return;
  }
  console.log('Look items linked successfully:', lookItems.length);
  console.log('Seeding fully completed with perfect schema and relation mapping!');
}

seed().catch(console.error);
