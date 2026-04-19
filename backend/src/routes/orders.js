const express = require("express");
const db = require("../database");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order checkout and history
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Checkout — save order from current cart and clear cart
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", (_req, res) => {
  const cartItems = db.prepare(`
    SELECT c.id as cart_id, c.product_id, c.quantity, p.price
    FROM cart c JOIN products p ON c.product_id = p.id
  `).all();

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  db.exec("BEGIN");
  let order;
  try {
    const orderResult = db.prepare("INSERT INTO orders (total) VALUES (?)").run(
      Math.round(total * 100) / 100
    );
    const orderId = orderResult.lastInsertRowid;

    const insertItem = db.prepare(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
    );
    for (const item of cartItems) {
      insertItem.run(orderId, item.product_id, item.quantity, item.price);
    }

    db.prepare("DELETE FROM cart").run();
    order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  res.status(201).json(order);
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List all orders (admin)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", (_req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  res.json(orders);
});

module.exports = router;
