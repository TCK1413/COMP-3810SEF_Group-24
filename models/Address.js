// models/Address.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const { getNames } = require('country-list');

const addressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    
    postalCode: { 
      type: String, 
      required: true, 
      trim: true,
      match: [/^[0-9]+$/, 'Postal Code must contain only numbers.'] // 
    },
    
    country: { 
      type: String, 
      required: true, 
      enum: {
        values: getNames(),
        message: 'You must select a valid country from the list.'
      }
    },
    
    phone: { 
      type: String, 
      trim: true,
  
      match: [/^[0-9]+$/, 'Phone must contain only numbers.'] 
    },
    
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
