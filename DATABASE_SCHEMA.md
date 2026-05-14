# Mayura Fashion E-Commerce Database Schema

## Overview
The Mayura database is built on Supabase PostgreSQL with Row Level Security (RLS) enabled on all tables. The schema supports a single-vendor fashion e-commerce platform where products are sold within outfit collections (called "looks").

## Tables

### 1. **users**
Stores user account information with role-based access control.

**Columns:**
- `id` (uuid, PK) - Auth user ID from Supabase Auth
- `email` (text, UNIQUE) - User email address
- `full_name` (text) - User's full name
- `phone` (text) - User's phone number
- `role` (text, DEFAULT: 'customer') - Either 'customer' or 'admin'
- `status` (text, DEFAULT: 'active') - Account status
- `profile_image_url` (text) - Profile picture URL from Vercel Blob
- `addresses` (jsonb) - JSON array of address objects
- `created_at`, `updated_at` (timestamps)

**RLS Policies:**
- Users can view/edit their own profile
- Admins can view and manage all users

---

### 2. **categories**
Product and look categories for organization.

**Columns:**
- `id` (uuid, PK)
- `name` (text, UNIQUE) - Category name
- `slug` (text, UNIQUE) - URL-friendly slug
- `description` (text) - Category description
- `image_url` (text) - Category image
- `created_at` (timestamp)

**RLS Policies:**
- Everyone can view categories
- Only admins can create/edit/delete categories

---

### 3. **products**
Individual fashion items that exist only within looks.

**Columns:**
- `id` (uuid, PK)
- `name` (text) - Product name
- `description` (text) - Product description
- `price` (numeric) - Base price
- `discount_percentage` (int) - Discount if applicable
- `image_url` (text) - Product image URL
- `category_id` (uuid, FK) - Reference to categories
- `size_options` (text[]) - Available sizes (e.g., ['XS', 'S', 'M', 'L', 'XL'])
- `color_options` (text[]) - Available colors
- `gender` (text) - Gender category ('Male', 'Female', 'Unisex')
- `in_stock` (boolean, DEFAULT: true)
- `created_at`, `updated_at` (timestamps)

**RLS Policies:**
- Everyone can view products
- Only admins can create/edit/delete products

---

### 4. **looks** (Outfits)
Collections of products forming complete fashion looks.

**Columns:**
- `id` (uuid, PK)
- `name` (text) - Look name/identifier
- `title` (text) - Display title
- `description` (text) - Look description
- `category_id` (uuid, FK) - Reference to categories
- `model_image_url` (text) - Hero image showing the complete look
- `background_color` (text, DEFAULT: '#F5F5F0')
- `gender` (text) - Gender category ('Male', 'Female', 'Unisex')
- `featured` (boolean) - Whether look is featured on home page
- `created_at`, `updated_at` (timestamps)

**RLS Policies:**
- Everyone can view looks
- Only admins can create/edit/delete looks

---

### 5. **look_items** (Outfit Items)
Junction table linking products to looks.

**Columns:**
- `id` (uuid, PK)
- `look_id` (uuid, FK) - Reference to looks
- `product_id` (uuid, FK) - Reference to products
- `position` (text) - Position identifier in the look
- `label` (text) - Optional label for the product in this look
- `discount_label` (text) - Optional discount label
- `created_at` (timestamp)

**RLS Policies:**
- Everyone can view look_items
- Only admins can create/edit/delete look_items

---

### 6. **look_reviews**
Customer reviews and ratings for looks.

**Columns:**
- `id` (uuid, PK)
- `look_id` (uuid, FK) - Reference to looks
- `user_id` (uuid, FK) - Reference to users
- `rating` (int) - Rating from 1-5
- `review_text` (text) - Review content
- `created_at`, `updated_at` (timestamps)

**RLS Policies:**
- Everyone can view reviews
- Users can create/edit their own reviews
- Admins can manage all reviews

---

### 7. **favorites** (Wishlist)
Customer wishlist for looks.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK) - Reference to users
- `look_id` (uuid, FK) - Reference to looks
- `created_at` (timestamp)
- UNIQUE(user_id, look_id) - Prevent duplicate favorites

**RLS Policies:**
- Users can only view their own favorites
- Users can only manage their own favorites

---

### 8. **carts**
Shopping cart containers for users.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK, UNIQUE) - Reference to users (one cart per user)
- `created_at`, `updated_at` (timestamps)

**RLS Policies:**
- Users can only view/edit their own cart
- Admins can view all carts

---

### 9. **cart_items**
Items in the shopping cart (can be products or looks).

**Columns:**
- `id` (uuid, PK)
- `cart_id` (uuid, FK) - Reference to carts
- `product_id` (uuid, FK) - Reference to products (NULL if adding a look)
- `look_id` (uuid, FK) - Reference to looks (NULL if adding a product)
- `item_type` (text) - Either 'product' or 'look'
- `quantity` (int, DEFAULT: 1)
- `size` (text) - Selected size
- `color` (text) - Selected color
- `created_at` (timestamp)

**RLS Policies:**
- Users can only view/edit items in their own cart
- Admins can view all cart items

---

### 10. **orders**
Customer orders.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK) - Reference to users
- `order_number` (text, UNIQUE) - Human-readable order number
- `total_amount` (numeric) - Total order amount
- `status` (text, DEFAULT: 'pending') - Order status (pending, processing, shipped, delivered, cancelled)
- `payment_status` (text, DEFAULT: 'pending') - Payment status
- `delivery_address` (jsonb) - Delivery address object
- `shipping_address` (jsonb) - Shipping address object
- `created_at`, `updated_at` (timestamps)

**RLS Policies:**
- Users can only view their own orders
- Users can update their own orders
- Admins can view and manage all orders

---

### 11. **order_items**
Line items in orders.

**Columns:**
- `id` (uuid, PK)
- `order_id` (uuid, FK) - Reference to orders
- `product_id` (uuid, FK) - Reference to products
- `quantity` (int) - Quantity ordered
- `price` (numeric) - Price at time of order
- `size` (text) - Size if applicable
- `color` (text) - Color if applicable
- `created_at` (timestamp)

**RLS Policies:**
- Users can only view items in their own orders
- Admins can view all order items

---

### 12. **payments**
Payment records for orders.

**Columns:**
- `id` (uuid, PK)
- `order_id` (uuid, FK) - Reference to orders
- `razorpay_payment_id` (text, UNIQUE) - Razorpay payment ID
- `razorpay_order_id` (text, UNIQUE) - Razorpay order ID
- `amount` (numeric) - Payment amount
- `status` (text) - Payment status (pending, authorized, captured, failed, refunded)
- `created_at`, `updated_at` (timestamps)

**RLS Policies:**
- Users can only view payments for their orders
- Admins can view and manage all payments

---

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with role-based policies:
- **Customers**: Can only access their own data (carts, orders, favorites, reviews)
- **Admins**: Have full access to all data for management purposes
- **Public Access**: Products, looks, categories, and reviews are readable by all authenticated users

### Authentication
- User authentication via Supabase Auth
- Session management via JWT tokens stored in HTTP-only cookies
- Middleware redirects unauthenticated requests to login

### Password Security
- Passwords are hashed using Supabase Auth's built-in mechanisms
- Never stored or transmitted in plain text

---

## Key Relationships

```
users
  ├── carts (1:1)
  │   └── cart_items (1:many)
  │       └── products (many:1)
  │       └── looks (many:1)
  ├── orders (1:many)
  │   ├── order_items (1:many)
  │   │   └── products (many:1)
  │   └── payments (1:many)
  │       └── razorpay_payment_id
  ├── favorites (1:many)
  │   └── looks (many:1)
  └── look_reviews (1:many)
      └── looks (many:1)

looks (outfits)
  ├── categories (many:1)
  ├── look_items (1:many)
  │   └── products (many:1)
  └── look_reviews (1:many)
      └── users (many:1)

products
  └── categories (many:1)
```

---

## Data Migration Notes

- All timestamps are in UTC (timestamp with time zone)
- JSON fields (addresses, delivery_address) should follow consistent structure
- Images are stored in Vercel Blob and only URLs are stored in the database
- Inventory management: `products.in_stock` should be updated when orders are placed
- Order numbers are auto-generated in format: `ORD-YYYYMMDD-XXXXX`

---

## Query Performance Indexes

The following indexes are created for optimal query performance:
- `idx_users_role` - For admin role filtering
- `idx_users_email` - For email lookups
- `idx_cart_items_item_type` - For cart filtering by type
- `idx_orders_status` - For order status queries
- `idx_look_items_look_id` - For fetching products in a look
- `idx_look_reviews_rating` - For sorting by rating
- `idx_favorites_user_id` - For fetching user favorites
- `idx_payments_razorpay_id` - For Razorpay reconciliation
- `idx_orders_payment_status` - For payment status queries
