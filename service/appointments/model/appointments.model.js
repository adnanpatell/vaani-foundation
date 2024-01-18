"use strict";
const AppointmentsSchema = require("./appointments.schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const CONSTANTS = require('../../../config/constant');
const CC = require("./../../../config/constant_collection");
const logger = require("./../../../config/winston");
const jwt = require("jsonwebtoken");


class AppointmentsModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }


  async createAppointments(appointmentsData) {
    try {
      let appointments = new AppointmentsSchema(appointmentsData);
      const result = await appointments.save();
      return result;
    } catch (error) {
      return error;
    }
  }


  async getAppointmentsOne(where) {
      try {
        return await AppointmentsSchema.findOne(where);
      } catch (error) {
        return error;
      }    
  }

  /*
   * Name of the Method : updateUser
   * Description : update User details
   */
  async updateAppointmentsById(updObj, where) {    
      try {
        return await AppointmentsSchema.updateOne(where, { $set: updObj });        
      } catch (error) {
        console.log(error);
        return error;
      }    
  }

  async coundAppointment(where) {    
    try {
      return await AppointmentsSchema.find(where).count();
    } catch (error) {
      console.log(error);
      return error;
    }    
}

  async getAppointmentsList(whereObj) {
    try {
      const result = await AppointmentsSchema.aggregate([
        {
          $match:whereObj
        },
        {
          $lookup: {
            from: CC.P001_PATIENTS,
            localField: "patient_id",
            foreignField: "_id",
            as: "patientData"
          }
        },
        {
          $lookup: {
            from: CC.U001_USERS,
            localField: "doctor_id",
            foreignField: "_id",
            as: "doctorData"
          }
        },
        {
          $unwind:{
            path:"$patientData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind:{
            path:"$doctorData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project:{
            patient_id: 1,
            phcid: 1,
            doctor_id: 1,
            complains: 1,
            history: 1,
            status: 1,
            createdAt:1,
            appointment_id: 1,
            doctors_remark: 1,
            lab_reports: 1,
            medicine: 1,
            disease_id: 1,
            medicine: 1,
            // "patientData.patient_name": {$concat:[ "$patientData.first_name", " ", "$patientData.middle_name", " ", "$patientData.last_name" ]},
            "patientData.patient_name":1,
            "patientData.email": 1,
            "patientData.mobile": 1,
            "patientData.birth_date": 1,
            "patientData.gender": 1,
            "patientData.country": 1,
            "patientData.state": 1,
            "patientData.city": 1,
            "patientData.address": 1,
            "patientData.adharcard_number": 1,
            "patientData.unique_id": 1,
            "doctorData.doctor_name": {$concat:[ "$doctorData.first_name", " ", "$doctorData.middle_name", " ", "$doctorData.last_name" ]},
            "doctorData._id": 1,
          }
        }
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async getAppointmentsForStatistics(whereObj) {
    try {
      const result = await AppointmentsSchema.aggregate([
        {
          $match:whereObj
        },
        {
          $project:{
            createdAt:1,
            phcid:1,
            yearMonth:{
              "$dateToString": {
                "date": "$createdAt",
                "format": "%m-%Y",
              } 
            }
          }
        },
        {
          $group: {
            _id: "$yearMonth", 
            visits: {$sum: 1}
          }
        }
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }  
}

module.exports = new AppointmentsModel();
