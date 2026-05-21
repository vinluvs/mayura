// Auto-generated Supabase types for the Mayura database schema
// Run: supabase gen types typescript --local > lib/types/database.ts

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin' | 'developer' | 'owner'
          status: string
          profile_image_url: string | null
          addresses: any[] // JSON array of address objects
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'developer' | 'owner'
          status?: string
          profile_image_url?: string | null
          addresses?: any[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'developer' | 'owner'
          status?: string
          profile_image_url?: string | null
          addresses?: any[] | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_urls: string[] | null
          category_id: string
          size_options: string[] | null
          color_options: string[] | null
          gender: string | null
          in_stock: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_urls?: string[] | null
          category_id: string
          size_options?: string[] | null
          color_options?: string[] | null
          gender?: string | null
          in_stock?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          price?: number
          image_urls?: string[] | null
          category_id?: string
          size_options?: string[] | null
          color_options?: string[] | null
          gender?: string | null
          in_stock?: boolean
          updated_at?: string
        }
      }
      looks: {
        Row: {
          id: string
          name: string
          title: string
          description: string | null
          category_id: string
          image_urls: string[] | null
          background_color: string
          gender: string | null
          featured: boolean
          discount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          description?: string | null
          category_id: string
          image_urls?: string[] | null
          background_color?: string
          gender?: string | null
          featured?: boolean
          discount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          title?: string
          description?: string | null
          category_id?: string
          image_urls?: string[] | null
          background_color?: string
          gender?: string | null
          featured?: boolean
          discount?: number | null
          updated_at?: string
        }
      }
      look_items: {
        Row: {
          id: string
          look_id: string
          product_id: string
          position: string
          label: string | null
          discount_label: string | null
          created_at: string
        }
        Insert: {
          id?: string
          look_id: string
          product_id: string
          position: string
          label?: string | null
          discount_label?: string | null
          created_at?: string
        }
        Update: {
          position?: string
          label?: string | null
          discount_label?: string | null
        }
      }
      look_reviews: {
        Row: {
          id: string
          look_id: string
          user_id: string
          rating: number
          review_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          look_id: string
          user_id: string
          rating: number
          review_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          rating?: number
          review_text?: string | null
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string | null
          look_id: string | null
          item_type: 'product' | 'look'
          quantity: number
          size: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id?: string | null
          look_id?: string | null
          item_type?: 'product' | 'look'
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          quantity?: number
          size?: string | null
          color?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          total_amount: number
          status: string
          payment_status: string
          delivery_address: any | null
          shipping_address: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          total_amount: number
          status?: string
          payment_status?: string
          delivery_address?: any | null
          shipping_address?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: string
          payment_status?: string
          delivery_address?: any | null
          shipping_address?: any | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size?: string | null
          color?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          look_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          look_id: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          razorpay_payment_id: string | null
          razorpay_order_id: string | null
          amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
