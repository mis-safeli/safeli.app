// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Environment variables for production
const isProduction = process.env.NODE_ENV === 'production';

// ✅ CORS Configuration for Render
app.use(cors({
  origin: [
    "https://mis-safeli.github.io",
    "http://localhost:3000",
    "https://safeli-app.onrender.com"
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(bodyParser.json());

// ✅ PostgreSQL Connection with Environment Variables
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'dpg-d3l2j449c44c73914930-a.oregon-postgres.render.com',
  database: process.env.DB_NAME || 'safelidb',
  password: process.env.DB_PASSWORD || 'e0sxce39kiPRTyw9Ye6XRb1OMILQCa7e',
  port: process.env.DB_PORT || 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// ✅ Database connection
pool.connect()
  .then(() => console.log('✅ PostgreSQL connected successfully!'))
  .catch(err => {
    console.error('❌ DB connection error:', err.message);
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying database connection...');
      pool.connect();
    }, 5000);
  });

// ✅ Root endpoint for Render
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Safeli Server is running on Render',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ Health check endpoint for Render
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      message: 'Server and Database are running properly',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: err.message 
    });
  }
});

// ==================== Sales Endpoints ====================

// GET all sales
app.get('/sales', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        timestamp, order_no, battery_specification, application, iot, iot_type, 
        quantity, branding_type, branding_label, charger, charger_qty, 
        soc, soc_qty, expected_dispatch_date, remarks 
      FROM sales 
      ORDER BY timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sales:', err.message);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// POST add new sale
app.post('/sales', async (req, res) => {
  try {
    const { 
      order_no, battery_specification, application, iot, iot_type, 
      quantity, branding_type, branding_label, charger, charger_qty, 
      soc, soc_qty, expected_dispatch_date, remarks 
    } = req.body;

    const query = `
      INSERT INTO sales (
        timestamp, order_no, battery_specification, application, iot, iot_type,
        quantity, branding_type, branding_label, charger, charger_qty,
        soc, soc_qty, expected_dispatch_date, remarks
      )
      VALUES (NOW(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING 
        timestamp, order_no, battery_specification, application, iot, iot_type, 
        quantity, branding_type, branding_label, charger, charger_qty, 
        soc, soc_qty, expected_dispatch_date, remarks
    `;

    const values = [
      order_no, battery_specification, application, iot, iot_type, quantity,
      branding_type, branding_label, charger, charger_qty, soc, soc_qty,
      expected_dispatch_date, remarks
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding sale:', err.message);
    res.status(500).json({ error: 'Failed to add sale' });
  }
});

// PUT edit sale by order_no
app.put('/sales/:order_no', async (req, res) => {
  try {
    const { order_no } = req.params;
    const updatedFields = { ...req.body };

    const columnMapping = {
      order_no: 'order_no', battery_specification: 'battery_specification', application: 'application',
      iot: 'iot', iot_type: 'iot_type', quantity: 'quantity', branding_type: 'branding_type',
      branding_label: 'branding_label', charger: 'charger', charger_qty: 'charger_qty',
      soc: 'soc', soc_qty: 'soc_qty', expected_dispatch_date: 'expected_dispatch_date', remarks: 'remarks'
    };

    const keys = Object.keys(updatedFields).filter(key => columnMapping[key]);
    if (keys.length === 0)
      return res.status(400).json({ error: 'No valid fields to update' });

    const setString = keys.map((key, idx) => `${columnMapping[key]}=$${idx + 1}`).join(', ');
    const values = keys.map(key => updatedFields[key]);
    values.push(order_no);

    const query = `
      UPDATE sales 
      SET ${setString} 
      WHERE order_no=$${values.length}
      RETURNING timestamp, order_no, battery_specification, application, iot, iot_type,
        quantity, branding_type, branding_label, charger, charger_qty, 
        soc, soc_qty, expected_dispatch_date, remarks
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Sale not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating sale:', err.message);
    res.status(500).json({ error: 'Failed to update sale' });
  }
});

// DELETE sale by order_no
app.delete('/sales/:order_no', async (req, res) => {
  try {
    const { order_no } = req.params;
    const result = await pool.query(`
      DELETE FROM sales 
      WHERE order_no=$1 
      RETURNING timestamp, order_no, battery_specification, application, iot, iot_type,
        quantity, branding_type, branding_label, charger, charger_qty, 
        soc, soc_qty, expected_dispatch_date, remarks
    `, [order_no]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Sale not found' });

    res.json({ message: 'Sale deleted successfully', sale: result.rows[0] });
  } catch (err) {
    console.error('Error deleting sale:', err.message);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
});

// ==================== Clients Endpoints ====================

// GET all clients
app.get('/clients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        dealer_id, firm_name, contact_details, district, dealer_name,
        address, region, state, city, pincode, gst_numb, telephone
      FROM clients
      ORDER BY dealer_id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching clients:', err.message);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET single client by dealer_id
app.get('/clients/:dealer_id', async (req, res) => {
  try {
    const dealer_id = parseInt(req.params.dealer_id, 10);
    
    const result = await pool.query(`
      SELECT 
        dealer_id, firm_name, contact_details, district, dealer_name,
        address, region, state, city, pincode, gst_numb, telephone
      FROM clients 
      WHERE dealer_id = $1
    `, [dealer_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching client:', err.message);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST add new client
app.post('/clients', async (req, res) => {
  try {
    const {
      dealer_id, firm_name, contact_details, district, dealer_name, address, region,
      state, city, pincode, gst_numb, telephone
    } = req.body;

    // Validation
    if (!firm_name || !contact_details) {
      return res.status(400).json({ error: 'Firm name and contact details are required' });
    }

    const query = `
      INSERT INTO clients (
        dealer_id, firm_name, contact_details, district, dealer_name, address, region, state,
        city, pincode, gst_numb, telephone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING dealer_id, firm_name, contact_details, district, dealer_name,
        address, region, state, city, pincode, gst_numb, telephone
    `;

    const values = [
      dealer_id, firm_name, contact_details, district, dealer_name, address, region,
      state, city, pincode, gst_numb, telephone
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding client:', err.message);
    res.status(500).json({ error: 'Failed to add client' });
  }
});

// PUT edit client by dealer_id
app.put('/clients/:dealer_id', async (req, res) => {
  try {
    const dealer_id = parseInt(req.params.dealer_id, 10);
    const updatedFields = { ...req.body };

    const columnMapping = {
      firm_name: 'firm_name', 
      contact_details: 'contact_details', 
      district: 'district',
      dealer_name: 'dealer_name', 
      address: 'address', 
      region: 'region', 
      state: 'state',
      city: 'city', 
      pincode: 'pincode', 
      gst_numb: 'gst_numb', 
      telephone: 'telephone'
    };

    const keys = Object.keys(updatedFields).filter(key => columnMapping[key]);
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setString = keys.map((key, idx) => `${columnMapping[key]} = $${idx + 1}`).join(', ');
    const values = keys.map(key => updatedFields[key]);
    values.push(dealer_id);

    const query = `
      UPDATE clients
      SET ${setString}
      WHERE dealer_id = $${values.length}
      RETURNING dealer_id, firm_name, contact_details, district, dealer_name,
        address, region, state, city, pincode, gst_numb, telephone
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating client:', err.message);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE client by dealer_id
app.delete('/clients/:dealer_id', async (req, res) => {
  try {
    const dealer_id = parseInt(req.params.dealer_id, 10);
    
    const result = await pool.query(`
      DELETE FROM clients
      WHERE dealer_id = $1
      RETURNING dealer_id, firm_name, contact_details, district, dealer_name,
        address, region, state, city, pincode, gst_numb, telephone
    `, [dealer_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ 
      message: 'Client deleted successfully', 
      client: result.rows[0] 
    });
  } catch (err) {
    console.error('Error deleting client:', err.message);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// Search clients
app.get('/clients/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    const result = await pool.query(`
      SELECT 
        dealer_id, firm_name, contact_details, district, dealer_name,
        address, region, state, city, pincode, gst_numb, telephone
      FROM clients
      WHERE 
        firm_name ILIKE $1 OR 
        dealer_name ILIKE $1 OR 
        contact_details ILIKE $1 OR
        district ILIKE $1 OR
        city ILIKE $1 OR
        gst_numb ILIKE $1
      ORDER BY dealer_id ASC
    `, [`%${query}%`]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error searching clients:', err.message);
    res.status(500).json({ error: 'Failed to search clients' });
  }
});

// ==================== Users Endpoints ====================

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        user_id, user_name, contact, email, role,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
      FROM users
      ORDER BY user_id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET single user by user_id
app.get('/api/users/:user_id', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id, 10);
    
    const result = await pool.query(`
      SELECT 
        user_id, user_name, contact, email, role,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
      FROM users 
      WHERE user_id = $1
    `, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST add new user
app.post('/api/users', async (req, res) => {
  try {
    const {
      user_name, email, contact, role
    } = req.body;

    // Validation
    if (!user_name || !email || !role) {
      return res.status(400).json({ error: 'Username, email and role are required' });
    }

    const query = `
      INSERT INTO users (
        user_name, email, contact, role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING 
        user_id, user_name, contact, email, role,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
    `;

    const values = [user_name, email, contact, role];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding user:', err.message);
    
    // Handle unique constraint violation for email
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// PUT edit user by user_id
app.put('/api/users/:user_id', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id, 10);
    const updatedFields = { ...req.body };

    const columnMapping = {
      user_name: 'user_name', 
      email: 'email', 
      contact: 'contact',
      role: 'role'
    };

    const keys = Object.keys(updatedFields).filter(key => columnMapping[key]);
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setString = keys.map((key, idx) => `${columnMapping[key]} = $${idx + 1}`).join(', ');
    const values = keys.map(key => updatedFields[key]);
    values.push(user_id);

    const query = `
      UPDATE users
      SET ${setString}
      WHERE user_id = $${values.length}
      RETURNING 
        user_id, user_name, contact, email, role,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err.message);
    
    // Handle unique constraint violation for email
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user by user_id
app.delete('/api/users/:user_id', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id, 10);
    
    const result = await pool.query(`
      DELETE FROM users
      WHERE user_id = $1
      RETURNING 
        user_id, user_name, contact, email, role,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
    `, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'User deleted successfully', 
      user: result.rows[0] 
    });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Search users
app.get('/api/users/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    const result = await pool.query(`
      SELECT 
        user_id, user_name, contact, email, role,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
      FROM users
      WHERE 
        user_name ILIKE $1 OR 
        email ILIKE $1 OR 
        contact ILIKE $1 OR
        role ILIKE $1
      ORDER BY user_id ASC
    `, [`%${query}%`]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error searching users:', err.message);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// ==================== Authentication Endpoints ====================

// POST login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check if user exists with this email
    const result = await pool.query(`
      SELECT 
        user_id, user_name, contact, email, role,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
      FROM users 
      WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found with this email' 
      });
    }

    const user = result.rows[0];

    // Check if password matches contact number
    if (password === user.contact) {
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.user_id,
          name: user.user_name,
          email: user.email,
          contact: user.contact,
          role: user.role
        },
        token: 'user-authenticated'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid contact number'
      });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// GET check auth status
app.get('/api/auth/check', async (req, res) => {
  try {
    res.json({ 
      authenticated: true,
      message: 'Auth check endpoint' 
    });
  } catch (err) {
    console.error('Auth check error:', err.message);
    res.status(500).json({ error: 'Auth check failed' });
  }
});

// POST logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    res.json({ 
      success: true,
      message: 'Logout successful' 
    });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Health check: https://safeli-app.onrender.com/health`);
  console.log(`🏠 Home: https://safeli-app.onrender.com`);
});

module.exports = app;