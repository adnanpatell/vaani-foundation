"use strict";
const DiseasesSchema = require("./diseases.schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const CONSTANTS = require('../../../config/constant');
const CC = require("./../../../config/constant_collection");
const logger = require("./../../../config/winston");
const jwt = require("jsonwebtoken");


class DiseasesModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }


  async createDiseases(diseasesData) {
    try {
      let diseases = new DiseasesSchema(diseasesData);
      const result = await diseases.save();
      return result;
    } catch (error) {
      return error;
    }
  }


  async getDiseasesOne(where) {    
      try {
        return await DiseasesSchema.findOne(where);
      } catch (error) {
        return error;
      }    
  }

  /*
   * Name of the Method : updateUser
   * Description : update User details
   */
  async updateDiseasesById(updObj, where) {    
      try {
        return await DiseasesSchema.updateOne({ _id: new ObjectId(where["_id"]) }, { $set: updObj });        
      } catch (error) {
        console.log(error);
        return error;
      }    
  }

  async getDiseasesList(whereObj) {
    try {
      const result = await DiseasesSchema.aggregate([
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

module.exports = new DiseasesModel();
