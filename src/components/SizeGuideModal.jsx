const mongoose = require("mongoose");

const sizeGuideSchema = new mongoose.Schema({
  rows: [
    {
      size: String,
      bust: String,
      waist: String,
      hips: String,
      notes: String,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SizeGuide", sizeGuideSchema);