const mongoose = require('mongoose');

const helplineSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    altNumber: { type: String, default: null },
    hours: { type: String, default: '24/7 Available' },
    is247: { type: Boolean, default: true },
    languages: [{ type: String }],
    region: {
      type: String,
      required: true,
      enum: ['India', 'Global', 'US', 'UK'],
    },
    type: [{ type: String, enum: ['Call', 'WhatsApp', 'SMS', 'Email', 'Web'] }],
    whatsapp: { type: String, default: null },
    categories: [{ type: String }],
    description: { type: String, required: true },
    verified: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Helpline', helplineSchema);
