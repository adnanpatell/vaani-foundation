const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

/**
 * User  Schema
 */
const DiseasesSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  is_deleted: {
      type: Boolean,
      default: false,
      index: true
  }
});


DiseasesSchema.plugin(timestamp);
const DiseasesModel = mongoose.model(CC.D001_DISEASES,DiseasesSchema);
module.exports = DiseasesModel;