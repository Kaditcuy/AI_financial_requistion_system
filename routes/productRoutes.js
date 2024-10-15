const express = require("express");
const router = express.router;
const db = require("../db");

/**===== Product Management (Admin Only) ===== */
// Fetch all products with pagination
router.get("/products", async (req, res) => {
  try {
    // Get query parameters
    const limit = parseInt(req.query.limit) || 10; // default limit is 10 products per page
    const page = parseInt(req.query.page) || 1; //default page is 1
    const offset = (page - 1) * limit; // how many poducts to skip to get you on the page requested

    // fetch products from the database with pagination
    const products = await db.query("SELECT * FROM products LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch details of a particular product
router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);
    if (product) {
      res.json(product);
    } else {
      res.status(400).json({ error: "Producct not found " });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

// Add a new product
router.post("/products", async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  try {
    await db.query(
      "INSERT INTO products (name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, quantity, category]
    );
    res.status(201).json({ message: "Product addedd successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update an existing product
router.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, quantity, category } = req.body;
  try {
    await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ? WHERE id = ?",
      [name, description, price, quantity, category, productId]
    );
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// delete a product
router.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    await db.query("DELETE FROM products WHERE id = ?", [productId]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "failed to delete product" });
  }
});

/** ===== Product Management (Public Access) ===== */
// Search for product by name or category with filtering by price
router.get("/products/search", async (req, res) => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      limit = 10,
      page = 1,
    } = req.query;
    const offset = (page - 1) * limit;

    //Base SQL query
    let query = "SELECT * FROM products WHERE 1=1";
    const queryParams = [];

    //Filter by name if provided name query is present in the query parameters
    if (name) {
      query += " AND name LIKE ?"; //extension of sql query
      queryParams.push(`%${name}%`); //Use LIKE for partial matches
    }

    //filter by category if provided
    if (category) {
      query += " AND category = ?";
      queryParams.push(category); //safely inserting the user query as values for sql lookup
    }

    //filter by price range if provided
    if (minPrice) {
      query += " AND price >= ?";
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      query += " AND price <= ?";
      queryParams.push(maxPrice);
    }

    // Add pagination
    query += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    //execute the query
    const products = await db.query(query, queryParams);

    res.status(200).json({
      success: true,
      data: products,
      pagination: { currentPage: page, limit: parseInt(limit) },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Ftech all products under a category with filtering for price range
router.get("/products/category/:category", async (req, res) => {});

/** ===== Sort products by alphabetical order, price, category  and quantity(knowing which products are well stocked and which are not readily available)*/
// sort by price (order => asc or desc)
router.get("/products/sort/price/:order", async (req, res) => {});

// sort by quantity (order => asc or desc)
router.get("/products/sort/quantity/:order", async (req, res) => {});

// sort alphabetically by name (order => A-Z asc or Z-A desc)
router.get("/products/sort/name/:order", async (req, res) => {});

module.exports = router;
