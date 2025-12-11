const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// GET all properties
router.get("/", getAllProperties);

// POST a new property
router.post("/", createProperty);

// GET a property by ID
router.get("/:propertyId", getPropertyById);

// PUT update a property by ID
router.put("/:propertyId", updateProperty);

// DELETE a property by ID
router.delete("/:propertyId", deleteProperty);

module.exports = router;
