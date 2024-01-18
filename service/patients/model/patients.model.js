"use strict";
const PatientsSchema = require("./patients.schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const CONSTANTS = require('../../../config/constant');
const CC = require("./../../../config/constant_collection");
const logger = require("./../../../config/winston");
const jwt = require("jsonwebtoken");


class UserModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }


  async createPatients(patientsData) {
    try {
      let patients = new PatientsSchema(patientsData);
      const result = await patients.save();
      return result;
    } catch (error) {
      return error;
    }
  }


  async getPatientOne(where) {    
      try {
        return await PatientsSchema.findOne(where);
      } catch (error) {
        return error;
      }    
  }

  /*
   * Name of the Method : updateUser
   * Description : update User details
   */
  async updatPatientById(updObj, where) {    
      try {
        return await PatientsSchema.updateOne({ _id: new ObjectId(where["_id"]) }, { $set: updObj });        
      } catch (error) {
        console.log(error);
        return error;
      }    
  }

  async updateManyPatient(updObj, where) {    
    try {
      return await PatientsSchema.updateMany(where, { $set: updObj });        
    } catch (error) {
      console.log(error);
      return error;
    }    
  }

  async countPatient( where) {    
    try {
      return await PatientsSchema.countDocuments(where);
    } catch (error) {
      console.log(error);
      return error;
    }    
  }

  async getPatientsList(whereObj) {
    try {
      const result = await PatientsSchema.aggregate([
        {
          $match:whereObj
        },
        {
          $lookup: {
            from: CC.U001B_USERS_ROLES,
            localField: "role",
            foreignField: "_id",
            as: "roleData"
          }
        },
        {
          $unwind:{
            path:"$roleData",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }  
  async deletePatientById(where) {    
    try {
      return await PatientsSchema.deleteOne(where);
    } catch (error) {
      return error;
    }    
  }
}

module.exports = new UserModel();
