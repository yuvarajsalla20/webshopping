const express = require("express");
const db = require("../database");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current cart with product details
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart items with product info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 */
router.get("/", (_req, res) => {
  const items = db.prepare(`
    SELECT c.id, c.product_id, c.quantity,
           p.name, p.price, p.image_url, p.description
    FROM cart c
    JOIN products p ON c.product_id = p.id
    ORDER BY c.id
  `).all();
  res.json(items);
});

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id]
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Cart item added or quantity updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ error: "product_id is required" });

  const product = db.prepare("SELECT id FROM products WHERE id = ?").get(product_id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const existing = db.prepare("SELECT * FROM cart WHERE product_id = ?").get(product_id);
  let cartId;
  if (existing) {
    db.prepare("UPDATE cart SET quantity = quantity + ? WHERE product_id = ?").run(quantity, product_id);
    cartId = existing.id;
  } else {
    const result = db.prepare("INSERT INTO cart (product_id, quantity) VALUES (?, ?)").run(product_id, quantity);
    cartId = result.lastInsertRowid;
  }

  const item = db.prepare(`
    SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url, p.description
    FROM cart c JOIN products p ON c.product_id = p.id
    WHERE c.id = ?
  `).get(cartId);

  res.status(201).json(item);
});

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated cart item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ error: "quantity must be >= 1" });

  const existing = db.prepare("SELECT id FROM cart WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Cart item not found" });

  db.prepare("UPDATE cart SET quantity = ? WHERE id = ?").run(quantity, id);

  const item = db.prepare(`
    SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url, p.description
    FROM cart c JOIN products p ON c.product_id = p.id
    WHERE c.id = ?
  `).get(id);

  res.json(item);
});

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM cart WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Cart item not found" });
  db.prepare("DELETE FROM cart WHERE id = ?").run(id);
  res.json({ deleted: true });
});

module.exports = router;
