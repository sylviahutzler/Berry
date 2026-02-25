const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const chokidar = require('chokidar');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'grocery_store',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Inventory file path - change this to match your file
const INVENTORY_FILE = path.join(__dirname, 'inventory.json'); // or 'inventory.json'

// ============================================
// FILE WATCHING AND AUTO-SYNC
// ============================================

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const products = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                products.push({
                    sku: row.sku,
                    name: row.name,
                    description: row.description,
                    category: row.category,
                    price: parseFloat(row.price),
                    quantity: parseInt(row.quantity)
                });
            })
            .on('end', () => resolve(products))
            .on('error', reject);
    });
}

function parseJSON(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return reject(err);
            try {
                const products = JSON.parse(data);
                resolve(products);
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function syncInventoryFromFile() {
    console.log('📦 Syncing inventory from file...');

    try {
        let products;

        // Detect file type and parse accordingly
        if (INVENTORY_FILE.endsWith('.csv')) {
            products = await parseCSV(INVENTORY_FILE);
        } else if (INVENTORY_FILE.endsWith('.json')) {
            products = await parseJSON(INVENTORY_FILE);
        } else {
            throw new Error('Unsupported file format. Use .csv or .json');
        }

        console.log(`Found ${products.length} products in file`);

        // Update database
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const product of products) {
                await client.query(`
                    INSERT INTO products (sku, name, description, category, price, quantity, last_updated)
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())
                    ON CONFLICT (sku)
                    DO UPDATE SET 
                        name = $2,
                        description = $3,
                        category = $4,
                        price = $5,
                        quantity = $6,
                        last_updated = NOW()
                `, [
                    product.sku,
                    product.name,
                    product.description,
                    product.category,
                    product.price,
                    product.quantity
                ]);
            }

            await client.query('COMMIT');
            console.log('✅ Inventory synced successfully!');

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Error syncing inventory:', error);
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('❌ Error reading inventory file:', error);
    }
}

// Watch the inventory file for changes
const watcher = chokidar.watch(INVENTORY_FILE, {
    persistent: true,
    ignoreInitial: false // Sync on startup
});

watcher
    .on('add', () => {
        console.log('📄 Inventory file detected');
        syncInventoryFromFile();
    })
    .on('change', () => {
        console.log('📝 Inventory file changed - syncing...');
        syncInventoryFromFile();
    })
    .on('error', error => console.error('❌ Watcher error:', error));

console.log(`👀 Watching for changes: ${INVENTORY_FILE}`);

// ============================================
// CUSTOMER API ENDPOINTS
// ============================================

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                product_id,
                sku,
                name,
                description,
                category,
                price,
                quantity,
                last_updated,
                CASE WHEN quantity > 0 THEN true ELSE false END as in_stock
            FROM products
            ORDER BY category, name
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
    const { category } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                product_id,
                sku,
                name,
                description,
                category,
                price,
                quantity,
                last_updated,
                CASE WHEN quantity > 0 THEN true ELSE false END as in_stock
            FROM products
            WHERE category = $1
            ORDER BY name
        `, [category]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                product_id,
                sku,
                name,
                description,
                category,
                price,
                quantity,
                last_updated,
                CASE WHEN quantity > 0 THEN true ELSE false END as in_stock
            FROM products
            WHERE product_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Search products
app.get('/api/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search query required' });
    }

    try {
        const result = await pool.query(`
            SELECT 
                product_id,
                sku,
                name,
                description,
                category,
                price,
                quantity,
                last_updated,
                CASE WHEN quantity > 0 THEN true ELSE false END as in_stock
            FROM products
            WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
            ORDER BY 
                CASE 
                    WHEN name ILIKE $1 THEN 1
                    WHEN description ILIKE $1 THEN 2
                    ELSE 3
                END,
                name
        `, [`%${q}%`]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT category
            FROM products
            WHERE category IS NOT NULL
            ORDER BY category
        `);

        res.json(result.rows.map(row => row.category));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    const { customer_name, customer_email, items } = req.body;
    // items: [{product_id, quantity}]

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check inventory and calculate total
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const productResult = await client.query(
                'SELECT product_id, name, price, quantity FROM products WHERE product_id = $1',
                [item.product_id]
            );

            if (productResult.rows.length === 0) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            const product = productResult.rows[0];

            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
            }

            total += product.price * item.quantity;
            orderItems.push({
                product_id: product.product_id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create order
        const orderResult = await client.query(
            'INSERT INTO orders (customer_name, customer_email, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING order_id',
            [customer_name, customer_email, total, 'pending']
        );

        const orderId = orderResult.rows[0].order_id;

        // Add order items and update inventory
        for (const item of orderItems) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            await client.query(
                'UPDATE products SET quantity = quantity - $1, last_updated = NOW() WHERE product_id = $2',
                [item.quantity, item.product_id]
            );
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            order_id: orderId,
            total: total.toFixed(2)
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// Get order details
app.get('/api/orders/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        const orderResult = await pool.query(`
            SELECT * FROM orders WHERE order_id = $1
        `, [orderId]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const itemsResult = await pool.query(`
            SELECT 
                oi.quantity,
                oi.price,
                p.name,
                p.sku
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = $1
        `, [orderId]);

        res.json({
            order: orderResult.rows[0],
            items: itemsResult.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
```

Create `.env`:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=grocery_store
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
