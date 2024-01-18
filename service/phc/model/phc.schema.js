const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

const cameraSchema = new mongoose.Schema({
  camera_url: {
    type: mongoose.Schema.Types.String,
    default: "",
    required: true,
  },
  camera_name: {
    type: String,
    default: "",
    required: true,
  },
});

/**
 * PHC  Schema
 */


const PHCsSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  phc_number:{
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    index: true
  },
  address:{
    type: mongoose.Schema.Types.String,
    default:""
  },
  streamSettings:{
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  is_deleted: {
      type: Boolean,
      default: false,
      index: true
  }
});


PHCsSchema.plugin(timestamp);
const PHCsModel = mongoose.model(CC.PH01_PHCS,PHCsSchema);
module.exports = PHCsModel;