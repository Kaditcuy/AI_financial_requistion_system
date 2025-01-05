const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware"); // Adjust the path based on your folder structure


/**===== Product Management (Admin Only) ===== */
// Fetch all products with pagination
router.get("/products", isAuthenticated, isAdmin, async (req, res) => {
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
router.get("/products/:id", isAuthenticated, isAdmin, async (req, res) => {
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
router.post("/products", isAuthenticated, isAdmin, async (req, res) => {
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
router.put("/products/:id", isAuthenticated, isAdmin, async (req, res) => {
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
router.delete("/products/:id", isAuthenticated, isAdmin, async (req, res) => {
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
router.get("/products/search", isAuthenticated, async (req, res) => {
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
router.get(
  "/products/category/:category",
  isAuthenticated,
  async (req, res) => {
    try {
      //extract selected category from query param
      const category = req.params.category;

      //extract optional query parameters for price range and page, default page is 1
      const { minPrice, maxPrice, limit = 10, page = 1 } = req.query;

      const offset = (page - 1) * limit;
      let baseQuery = "SELECT * FROM products WHERE category = ?";
      let queryParams = [category];

      //If price range is in the req query add them in the sql query
      if (minPrice && maxPrice) {
        baseQuery += " AND price BETWEEN ? AND ?";
        queryParams.push(minPrice, maxPrice);
      }

      //Add pagination to the query
      baseQuery += "LIMIT ? OFFSET ?";
      queryParams.push(parseInt(limit), parseInt(offset));

      //Execute the query
      const products = await db.query(baseQuery, queryParams);

      //Return the response
      res.status(200).json({
        success: true,
        data: products,
        pagination: { currentPage: page, limit: parseInt(limit) },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch products" });
    }
  }
);

/** ===== Sort products by alphabetical order, price, category  and quantity(knowing which products are well stocked and which are not readily available)*/
// sort by price (order => asc or desc)
router.get("/products/sort/price/:order", isAuthenticated, async (req, res) => {
  try {
    //extract the order parameter (asc or desc)
    const { order } = req.params;

    //validate the order parameter
    if (order !== "asc" && order !== "desc") {
      return res.status(400).json({
        success: false,
        message: "Invalid sort order. Use 'asc' or 'desc' .",
      });
    }

    //extract optional query params for pagination
    const { limit = 10, page = 1 } = req.query;

    //Check for valid limit
    if (parseInt(limit) <= 0 || parseInt(limit) > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Limit must be between 1 and 100" });
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);

    //fetch products from the database sorted by price
    const products = await db.query(
      `SELECT * FROM products ORDER BY price ${order.toUpperCase()} LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    //send a structured response
    res.status(200).json({
      success: true,
      data: products,
      pagination: { currentPage: page, limit: parseInt(limit) },
    });
  } catch (error) {
    console.error("Error fetching sorted products:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// sort by quantity (order => asc or desc)
router.get(
  "/products/sort/quantity/:order",
  isAuthenticated,
  async (req, res) => {
    try {
      // extracting only {order} from param but this order = will extract and store all params in an order variabe=le
      const { order } = req.params;

      if (order !== "asc" && order !== "desc") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid sort order" });
      }

      //extract optional params for pagination
      const { limit = 10, page = 1 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const [products] = await db.query(
        `SELECT * FROM products ORDER BY quantity ${order.toUpperCase()} LIMIT ? OFFSET ?`,
        [parseInt(limit), offset]
      );
      //send a structures response
      res.status(200).json({
        success: true,
        data: products,
        pagination: { currentPage: page, limit: parseInt(limit) },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server error" });
    }
  }
);

// sort alphabetically by name (order => A-Z asc or Z-A desc)
router.get("/products/sort/name/:order", isAuthenticated, async (req, res) => {
  try {
    // extracting only {order} from param but this order = will extract and store all params in an order variabe=le
    const { order } = req.params;

    if (order !== "asc" && order !== "desc") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sort order" });
    }

    //extract optional params for pagination
    const { limit = 10, page = 1 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [products] = await db.query(
      `SELECT * FROM products ORDER BY name ${order.toUpperCase()} LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );
    //send a structures response
    res.status(200).json({
      success: true,
      data: products,
      pagination: { currentPage: page, limit: parseInt(limit) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
});

module.exports = router;
