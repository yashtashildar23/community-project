const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, default: '5 min read' },
    summary: { type: String, required: true },
    content: [
      {
        heading: { type: String },
        text: { type: String },
        list: [{ type: String }],
      },
    ],
    color: { type: String, default: 'bg-blue-100 text-blue-800' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
