const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seed() {
  console.log('Starting database seeding...');

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

  // 2. Products
  const productsData = [
    // Formal Look Products
    { name: 'Velour Tailored Blazer', description: 'Premium structured velour blazer with gold accents.', price: 180, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=1000', category_id: catMap['formal'], size_options: ['S', 'M', 'L', 'XL'], color_options: ['Midnight Black', 'Imperial Blue'], in_stock: true },
    { name: 'Silk Charmeuse Trousers', description: 'High-waisted wide leg trousers in pure silk.', price: 119, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=1000', category_id: catMap['formal'], size_options: ['S', 'M', 'L'], color_options: ['Midnight Black'], in_stock: true },

    // Casual Look Products
    { name: 'Linen Artisan Tunic', description: 'Breathable longline tunic woven from organic premium linen.', price: 89, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000', category_id: catMap['casual'], size_options: ['XS', 'S', 'M', 'L'], color_options: ['Ivory White', 'Desert Sage'], in_stock: true },
    { name: 'Classic Suede Loafers', description: 'Handcrafted unlined suede loafers for superior comfort.', price: 110, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000', category_id: catMap['casual'], size_options: ['8', '9', '10', '11'], color_options: ['Sand', 'Chestnut'], in_stock: true },

    // Party Look Products
    { name: 'Aura Sequined Gown', description: 'Floor-sweeping mesh gown adorned with reflective micropieces.', price: 249, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000', category_id: catMap['party'], size_options: ['XS', 'S', 'M'], color_options: ['Rose Gold', 'Obsidian'], in_stock: true },
    { name: 'Chandelier Crystal Cascade Earrings', description: 'Dangling cascade statement pieces with authentic cut glass.', price: 100, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000', category_id: catMap['party'], size_options: ['One Size'], color_options: ['Gold/Clear'], in_stock: true },

    // Traditional Look Products
    { name: 'Zari Brocade Silk Sherwani / Ensemble', description: 'Intricate classic golden threadwork sherwani over layered pure fabric.', price: 120, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', category_id: catMap['traditional'], size_options: ['M', 'L', 'XL'], color_options: ['Royal Crimson', 'Cream Gold'], in_stock: true },
    { name: 'Handloom Tussar Trousers', description: 'Sleek traditional base legwear complementing rich festive sets.', price: 59, discount_percentage: 0, image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', category_id: catMap['traditional'], size_options: ['M', 'L', 'XL'], color_options: ['Cream Gold'], in_stock: true }
  ];

  console.log('Inserting/rebuilding products...');
  // Delete existing products to avoid duplication mapping complexities if desired, or just insert new ones
  // Since products don't have a simple unique slug, let's clean up existing look items and products first to ensure fresh seed state.
  await supabase.from('look_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('looks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

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

  // 3. Looks
  const looksData = [
    { name: 'evening-elegance', title: 'Evening Elegance', description: 'A tailored masterpiece statement defining absolute luxury for formal galas.', category_id: catMap['formal'], model_image_url: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=1000', background_color: '#1A1A1A', featured: true },
    { name: 'casual-chic', title: 'Casual Chic', description: 'Laid back opulence utilizing pure unlined soft components for fluid daily aesthetics.', category_id: catMap['casual'], model_image_url: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=1000', background_color: '#F5F5F0', featured: true },
    { name: 'party-glamour', title: 'Party Glamour', description: 'Command the attention of the entire room with shimmering ambient interaction elements.', category_id: catMap['party'], model_image_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000', background_color: '#2A1B2C', featured: true },
    { name: 'weekend-vibe', title: 'Weekend Vibe', description: 'Traditional festive prestige woven closely with golden threads of generational heritage.', category_id: catMap['traditional'], model_image_url: 'https://images.unsplash.com/photo-1610030469983-98e55ec2999e?q=80&w=1000', background_color: '#3B2A20', featured: true }
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

  // 4. Look Items
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
    { look_id: lookMap['weekend-vibe'], product_id: prodMap['Handloom Tussar Trousers'], position: 'bottom', label: 'Traditional Lower' }
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
  console.log('Seeding fully completed!');
}

seed().catch(console.error);
