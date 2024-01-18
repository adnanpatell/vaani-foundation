const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

/**
 * User  Schema
 */
const MadicinesSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  category_id:{
    type: mongoose.Schema.Types.ObjectId,
    index: true
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


MadicinesSchema.plugin(timestamp);
const MadicinesModel = mongoose.model(CC.M001A_MEDICINES,MadicinesSchema);
module.exports = MadicinesModel;