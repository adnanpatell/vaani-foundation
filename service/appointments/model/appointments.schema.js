const mongoose = require('mongoose');
const CC = require('../../../config/constant_collection');
const timestamp = require('mongoose-timestamp');

/**
 * Appointments Schema
 */
const AppointmentsSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CC.P001_PATIENTS,
    index: true,
    required: true
  },
  appointment_id: {
    type: mongoose.Schema.Types.String,
    index: true,
    required: true
  },
  phcid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: CC.PH01_PHCS,
    index: true,
    required: true
  },
  doctor_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: CC.U001_USERS,
    index: true,
    required: true
  },
  complains:{
    type: mongoose.Schema.Types.String,
    default:""
  },
  history:{
    type: mongoose.Schema.Types.String,
    default:""
  },
  /* disease_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: CC.D001_DISEASES,
    index: true,
  }, */
  medicine:{
    type: mongoose.Schema.Types.Mixed,
    default:[]
  },
  doctors_remark:{
    type: mongoose.Schema.Types.String,
  },
  lab_reports:{
    type: mongoose.Schema.Types.Array,
    default:[]
  },
  status:{
    type: mongoose.Schema.Types.String,
    enum:["Pending", "Doctor", "Pharmacy", "Lab", "Complete"],
    default: "Pending"
  },
  is_deleted: {
      type: Boolean,
      default: false,
      index: true
  }
});


AppointmentsSchema.plugin(timestamp);
const AppointmentsModel = mongoose.model(CC.A001_APPOINTMENTS,AppointmentsSchema);
module.exports = AppointmentsModel;