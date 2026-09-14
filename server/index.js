import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { initDB, query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max per image
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// ==========================================
// 1. Health & Status
// ==========================================
app.get('/api/healthz', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected', time: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// ==========================================
// 2. Image Upload Endpoint
// ==========================================
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. Products Endpoints
// ==========================================

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, 
        name, 
        subtitle, 
        price::float as price, 
        category, 
        category_id as "categoryId", 
        description, 
        stock, 
        in_stock as "inStock", 
        images, 
        sizes, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM products 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT 
        id, 
        name, 
        subtitle, 
        price::float as price, 
        category, 
        category_id as "categoryId", 
        description, 
        stock, 
        in_stock as "inStock", 
        images, 
        sizes, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM products 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// CREATE product
app.post('/api/products', async (req, res) => {
  try {
    const {
      id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      subtitle = '',
      price = 0,
      category = 'Uncategorized',
      categoryId = '',
      description = '',
      stock = 10,
      inStock = true,
      images = [],
      sizes = ['Free Size']
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const calculatedInStock = stock > 0 && inStock;

    const result = await query(`
      INSERT INTO products (
        id, name, subtitle, price, category, category_id, description, stock, in_stock, images, sizes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING 
        id, name, subtitle, price::float as price, category, category_id as "categoryId", description, stock, in_stock as "inStock", images, sizes, created_at as "createdAt", updated_at as "updatedAt"
    `, [
      id,
      name,
      subtitle,
      Number(price),
      category,
      categoryId,
      description,
      parseInt(stock, 10) || 0,
      calculatedInStock,
      JSON.stringify(Array.isArray(images) ? images : []),
      JSON.stringify(Array.isArray(sizes) ? sizes : ['Free Size'])
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// UPDATE product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      subtitle,
      price,
      category,
      categoryId,
      description,
      stock,
      inStock,
      images,
      sizes
    } = req.body;

    const existing = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const current = existing.rows[0];
    const newStock = stock !== undefined ? parseInt(stock, 10) : current.stock;
    const newInStock = inStock !== undefined ? inStock : (newStock > 0);

    const result = await query(`
      UPDATE products SET
        name = COALESCE($1, name),
        subtitle = COALESCE($2, subtitle),
        price = COALESCE($3, price),
        category = COALESCE($4, category),
        category_id = COALESCE($5, category_id),
        description = COALESCE($6, description),
        stock = $7,
        in_stock = $8,
        images = COALESCE($9, images),
        sizes = COALESCE($10, sizes),
        updated_at = NOW()
      WHERE id = $11
      RETURNING 
        id, name, subtitle, price::float as price, category, category_id as "categoryId", description, stock, in_stock as "inStock", images, sizes, created_at as "createdAt", updated_at as "updatedAt"
    `, [
      name,
      subtitle,
      price !== undefined ? Number(price) : null,
      category,
      categoryId,
      description,
      newStock,
      newStock > 0 && newInStock,
      images !== undefined ? JSON.stringify(images) : null,
      sizes !== undefined ? JSON.stringify(sizes) : null,
      id
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ==========================================
// 4. Categories Endpoints
// ==========================================

// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, 
        name, 
        slug, 
        image, 
        item_count as "itemCount", 
        created_at as "createdAt"
      FROM categories 
      ORDER BY created_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// CREATE category
app.post('/api/categories', async (req, res) => {
  try {
    const {
      id = `cat_${Date.now()}`,
      name,
      slug,
      image = '',
      itemCount = 0
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const calculatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await query(`
      INSERT INTO categories (id, name, slug, image, item_count, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, name, slug, image, item_count as "itemCount", created_at as "createdAt"
    `, [id, name, calculatedSlug, image, itemCount]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// UPDATE category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image, itemCount } = req.body;

    const result = await query(`
      UPDATE categories SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        image = COALESCE($3, image),
        item_count = COALESCE($4, item_count)
      WHERE id = $5
      RETURNING id, name, slug, image, item_count as "itemCount", created_at as "createdAt"
    `, [name, slug, image, itemCount, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ==========================================
// 5. Orders & Live Tracking Endpoints
// ==========================================

// GET all orders (for Admin Panel)
app.get('/api/orders', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, 
        customer_name as "customerName", 
        customer_phone as "customerPhone", 
        customer_location as "customerLocation", 
        items, 
        total_price::float as "totalPrice", 
        decision, 
        stage, 
        status, 
        status_title as "statusTitle", 
        status_description as "statusDescription", 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM orders 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// TRACKING ENDPOINT: GET order by ID or Phone (for Customer Order Tracking Page)
app.get('/api/orders/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cleanIdentifier = identifier.trim();

    const result = await query(`
      SELECT 
        id, 
        customer_name as "customerName", 
        customer_phone as "customerPhone", 
        customer_location as "customerLocation", 
        items, 
        total_price::float as "totalPrice", 
        decision, 
        stage, 
        status, 
        status_title as "statusTitle", 
        status_description as "statusDescription", 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM orders 
      WHERE UPPER(id) = UPPER($1) 
         OR customer_phone = $1 
         OR REPLACE(customer_phone, ' ', '') = REPLACE($1, ' ', '')
      ORDER BY created_at DESC
    `, [cleanIdentifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return the latest matching order
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// CREATE order (called immediately upon WhatsApp checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const {
      id = `KW-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      customerPhone,
      customerLocation = '',
      items = [],
      totalPrice = 0,
      decision = 'pending',
      stage = 1,
      status = 'Order Placed',
      statusTitle = 'Order Placed & Logged',
      statusDescription = 'Your order has been recorded. Our boutique team will review and confirm availability.'
    } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Customer name and phone are required' });
    }

    const result = await query(`
      INSERT INTO orders (
        id, customer_name, customer_phone, customer_location, items, total_price, decision, stage, status, status_title, status_description, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING 
        id, customer_name as "customerName", customer_phone as "customerPhone", customer_location as "customerLocation", items, total_price::float as "totalPrice", decision, stage, status, status_title as "statusTitle", status_description as "statusDescription", created_at as "createdAt", updated_at as "updatedAt"
    `, [
      id,
      customerName,
      customerPhone,
      customerLocation,
      JSON.stringify(items),
      Number(totalPrice),
      decision,
      parseInt(stage, 10) || 1,
      status,
      statusTitle,
      statusDescription
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// UPDATE order (Admin updates decision, stage, or status)
// When decision changes to 'accepted', automatically deducts stock in products table!
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { decision, stage, status, statusTitle, statusDescription } = req.body;

  try {
    const existingOrderRes = await query('SELECT * FROM orders WHERE id = $1', [id]);
    if (existingOrderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentOrder = existingOrderRes.rows[0];
    const prevDecision = currentOrder.decision;
    const nextDecision = decision !== undefined ? decision : prevDecision;
    const items = typeof currentOrder.items === 'string' ? JSON.parse(currentOrder.items) : currentOrder.items;

    // Automatic Stock Management Transaction
    // 1. If transitioning from !accepted -> accepted: reduce stock
    if (prevDecision !== 'accepted' && nextDecision === 'accepted' && Array.isArray(items)) {
      for (const item of items) {
        const qty = parseInt(item.quantity, 10) || 1;
        await query(`
          UPDATE products 
          SET 
            stock = GREATEST(0, stock - $1),
            in_stock = CASE WHEN (stock - $1) > 0 THEN true ELSE false END,
            updated_at = NOW()
          WHERE id = $2
        `, [qty, item.id]);
      }
    }

    // 2. If transitioning from accepted -> !accepted (e.g. rejected): restore stock
    if (prevDecision === 'accepted' && nextDecision !== 'accepted' && Array.isArray(items)) {
      for (const item of items) {
        const qty = parseInt(item.quantity, 10) || 1;
        await query(`
          UPDATE products 
          SET 
            stock = stock + $1,
            in_stock = true,
            updated_at = NOW()
          WHERE id = $2
        `, [qty, item.id]);
      }
    }

    // Update the order row
    const result = await query(`
      UPDATE orders SET
        decision = COALESCE($1, decision),
        stage = COALESCE($2, stage),
        status = COALESCE($3, status),
        status_title = COALESCE($4, status_title),
        status_description = COALESCE($5, status_description),
        updated_at = NOW()
      WHERE id = $6
      RETURNING 
        id, customer_name as "customerName", customer_phone as "customerPhone", customer_location as "customerLocation", items, total_price::float as "totalPrice", decision, stage, status, status_title as "statusTitle", status_description as "statusDescription", created_at as "createdAt", updated_at as "updatedAt"
    `, [
      nextDecision,
      stage !== undefined ? parseInt(stage, 10) : null,
      status,
      statusTitle,
      statusDescription,
      id
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// ==========================================
// 6. Store Configuration Endpoints
// ==========================================

// GET store config
app.get('/api/config', async (req, res) => {
  try {
    const result = await query("SELECT value FROM store_config WHERE key = 'boutique_config'");
    if (result.rows.length === 0) {
      return res.json(null);
    }
    res.json(result.rows[0].value);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// UPDATE store config
app.put('/api/config', async (req, res) => {
  try {
    const configValue = req.body;
    const result = await query(`
      INSERT INTO store_config (key, value, updated_at)
      VALUES ('boutique_config', $1, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = NOW()
      RETURNING value
    `, [JSON.stringify(configValue)]);

    res.json(result.rows[0].value);
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: 'Failed to save config' });
  }
});

// ==========================================
// Start Server after Database Initialization
// ==========================================
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 [Server] Kundan Works API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
