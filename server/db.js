import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Connection configuration
const connectionString = process.env.DATABASE_URL || 
  `postgres://${process.env.POSTGRES_USER || 'kundan_admin'}:${process.env.POSTGRES_PASSWORD || 'kundan_secure_pass_2026'}@${process.env.POSTGRES_HOST || 'kundanworks-db'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'kundanworks'}`;

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);

/**
 * Initialize tables with retry mechanism to wait for PostgreSQL container
 */
export async function initDB(maxRetries = 10, delayMs = 2500) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[DB] Connecting to PostgreSQL (attempt ${attempt}/${maxRetries})...`);
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');

        // 1. Categories Table
        await client.query(`
          CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL,
            image TEXT,
            item_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        // 2. Products Table
        await client.query(`
          CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            subtitle TEXT,
            price NUMERIC NOT NULL,
            category TEXT,
            category_id TEXT,
            description TEXT,
            stock INTEGER DEFAULT 10,
            in_stock BOOLEAN DEFAULT true,
            images JSONB DEFAULT '[]'::jsonb,
            sizes JSONB DEFAULT '["Free Size"]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        // 3. Orders Table
        await client.query(`
          CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_location TEXT,
            items JSONB NOT NULL DEFAULT '[]'::jsonb,
            total_price NUMERIC NOT NULL,
            decision TEXT DEFAULT 'pending',
            stage INTEGER DEFAULT 1,
            status TEXT DEFAULT 'Order Placed',
            status_title TEXT DEFAULT 'Order Placed & Logged',
            status_description TEXT DEFAULT 'Your order has been recorded. Our boutique team will review and confirm availability.',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        // 4. Store Config Table
        await client.query(`
          CREATE TABLE IF NOT EXISTS store_config (
            key TEXT PRIMARY KEY,
            value JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        // 5. Indexes
        await client.query(`
          CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
          CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
          CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
        `);

        await client.query('COMMIT');
        console.log('✅ [DB] PostgreSQL schema initialized successfully.');
        return;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`[DB] Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) {
        console.error('❌ [DB] Could not connect to PostgreSQL after multiple attempts.');
        throw error;
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}
