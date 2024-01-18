"use strict";
const PhcsSchema = require("./phc.schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const CONSTANTS = require('../../../config/constant');
const CC = require("./../../../config/constant_collection");
const logger = require("./../../../config/winston");
const jwt = require("jsonwebtoken");


class PHcsModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }


  async createPHc(patientsData) {
    try {
      let patients = new PhcsSchema(patientsData);
      const result = await patients.save();
      return result;
    } catch (error) {
      return error;
    }
  }


  async getPHcOne(where) {    
      try {
        return await PhcsSchema.findOne(where);
      } catch (error) {
        return error;
      }    
  }

  /*
   * Name of the Method : updateUser
   * Description : update User details
   */
  async updatePHcById(updObj, where) {    
      try {
        return await PhcsSchema.updateOne({ _id: new ObjectId(where["_id"]) }, { $set: updObj });        
      } catch (error) {
        console.log(error);
        return error;
      }    
  }

  async getPHcList(whereObj) {
    try {
      const result = await PhcsSchema.aggregate([
        {
          $match:whereObj
        }
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }  
}

module.exports = new PHcsModel();
