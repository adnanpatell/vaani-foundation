const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

/**
 * User  Schema
 */
const MadicineCategorySchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  description: {
    type: mongoose.Schema.Types.String
  },  
  is_deleted: {
      type: Boolean,
      default: false,
      index: true
  }
  
  
});


MadicineCategorySchema.plugin(timestamp);
const MadicineCategoryModel = mongoose.model(CC.M001_MEDICINE_CATEGORIES,MadicineCategorySchema);
module.exports = MadicineCategoryModel;