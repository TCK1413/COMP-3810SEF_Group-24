// models/Address.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// --- MODIFICATION: Import country-list module ---
const { getNames } = require('country-list');

const addressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    
    // --- MODIFICATION: Added validation for postalCode ---
    postalCode: { 
      type: String, 
      required: true, 
      trim: true,
      // English Comment: Use regex 'match' to ensure it contains only numbers (as requested)
      match: [/^[0-9]+$/, 'Postal Code must contain only numbers.'] // 
    },
    
    // --- MODIFICATION: Added validation for country ---
    country: { 
      type: String, 
      required: true, 
      // English Comment: Use 'enum' to validate against the list from the country-list package 
      enum: {
        values: getNames(),
        message: 'You must select a valid country from the list.'
      }
    },
    
    // --- MODIFICATION: Added validation for phone ---
    phone: { 
      type: String, 
      trim: true,
      // English Comment: Use regex 'match' to ensure it contains only numbers (as requested)
      // We make it optional (no 'required') but if it exists, it must match
      match: [/^[0-9]+$/, 'Phone must contain only numbers.'] // 
    },
    
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
