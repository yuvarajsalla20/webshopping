const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "../../data/shop.db");

const db = new DatabaseSync(dbPath);

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price REAL NOT NULL
    );
  `);

  const count = db.prepare("SELECT COUNT(*) as c FROM products").get();
  if (count.c === 0) {
    const insert = db.prepare(
      "INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)"
    );
    db.exec("BEGIN");
    try {
      insert.run("Wireless Headphones", "Premium noise-cancelling over-ear headphones with 30-hour battery life.", 89.99, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400");
      insert.run("Mechanical Keyboard", "Compact TKL mechanical keyboard with RGB backlighting and tactile switches.", 129.99, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400");
      insert.run("USB-C Hub", "7-in-1 USB-C hub with HDMI 4K, 3x USB-A, SD card reader, and PD charging.", 49.99, "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400");
      insert.run("Laptop Stand", "Adjustable aluminium laptop stand, fits MacBook and 13–17 inch laptops.", 39.99, "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400");
      insert.run("Webcam HD 1080p", "Full HD webcam with auto-focus, built-in microphone, and privacy shutter.", 69.99, "https://images.unsplash.com/photo-1587815073078-f636169821e3?w=400");
      insert.run("Desk LED Lamp", "Eye-care LED desk lamp with 5 color modes, dimmer, and USB charging port.", 34.99, "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400");
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
}

initDb();

module.exports = db;
