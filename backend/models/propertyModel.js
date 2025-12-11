const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true }, // Short, descriptive name of the property
  type: { type: String, required: true }, // Property type, e.g., Apartment, House, Commercial
  description: { type: String, required: true }, // Detailed description of the property
  price: { type: Number, required: true }, // Cost of the property in relevant currency
  location: {
    address: { type: String, required: true }, // Street address
    city: { type: String, required: true }, // City
    state: { type: String, required: true } // State or region
  },
  squareFeet: { type: Number, required: true }, // Total area
  yearBuilt: { type: Number, required: true }, // Year of construction
  bedrooms: { type: Number, required: true } // Number of bedrooms
}, {
  timestamps: true // tạo createdAt và updatedAt tự động
});

// Add virtual field 'id'
propertySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id; // nếu muốn loại bỏ _id
    delete ret.__v; // loại bỏ version key
    return ret;
  }
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
