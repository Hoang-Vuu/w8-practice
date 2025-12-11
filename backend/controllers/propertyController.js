const Property = require("../models/propertyModel");
const mongoose = require("mongoose");

// GET /properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve properties", error: error.message });
  }
};

// POST /properties
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create({ ...req.body });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: "Failed to create property", error: error.message });
  }
};

// GET /properties/:propertyId
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve property", error: error.message });
  }
};

// PUT /properties/:propertyId
const updateProperty = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: "Failed to update property", error: error.message });
  }
};

// DELETE /properties/:propertyId
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const deletedProperty = await Property.findByIdAndDelete(propertyId);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property", error: error.message });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
