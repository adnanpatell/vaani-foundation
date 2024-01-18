const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
const timestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

/**
 * User  Schema
 */
const PatientsSchema = new mongoose.Schema({
  patient_name:{
    type: mongoose.Schema.Types.String
  },
  // first_name: {
  //   type: mongoose.Schema.Types.String
  // },
  // middle_name: {
  //   type: mongoose.Schema.Types.String
  // },
  // last_name: {
  //   type: mongoose.Schema.Types.String
  // },
  email: {
    type: mongoose.Schema.Types.String
  },
  contact_person: {
    type: mongoose.Schema.Types.String
  },
  mobile: {
    type: mongoose.Schema.Types.String
  },
  profile: {
    type: mongoose.Schema.Types.String
  },
  birth_date: {
    type: mongoose.Schema.Types.Date
  },
  age: {
    type: mongoose.Schema.Types.Number
  },
  gender: {
    type: mongoose.Schema.Types.String,
    enum:['Male', 'Female'],
    default: 'Male',
    index: true,
  },
  country:{
    type: mongoose.Schema.Types.String,
    index: true
  },
  state:{
    type: mongoose.Schema.Types.String,
    index: true
  },
  city:{
    type: mongoose.Schema.Types.String,
    index: true
  },
  taluka:{
    type: mongoose.Schema.Types.String,
    index: true
  },
  address:{
    type: mongoose.Schema.Types.String,
    default:""
  },
  adharcard_number:{
    type: mongoose.Schema.Types.String,
    default:""
  },  
  unique_id:{
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  is_deleted: {
      type: Boolean,
      default: false,
      index: true
  }
  
  
});


PatientsSchema.plugin(timestamp);
const PatientsModel = mongoose.model(CC.P001_PATIENTS,PatientsSchema);
module.exports = PatientsModel;