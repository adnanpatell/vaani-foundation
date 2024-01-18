"use strict";
const MedicineCategorySchema = require("./medicine-category.schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const CONSTANTS = require('../../../config/constant');
const CC = require("./../../../config/constant_collection");
const logger = require("./../../../config/winston");
const jwt = require("jsonwebtoken");


class MedicineCategoryModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }


  async createMedicineCategory(patientsData) {
    try {
      let patients = new MedicineCategorySchema(patientsData);
      const result = await patients.save();
      return result;
    } catch (error) {
      return error;
    }
  }

  async updateMedicineCategoryById(updObj, where) {    
    try {
      return await MedicineCategorySchema.updateOne({ _id: new ObjectId(where["_id"]) }, { $set: updObj });        
    } catch (error) {
      console.log(error);
      return error;
    }    
}

  async getMedicineCategoryOne(where) {    
      try {
        return await MedicineCategorySchema.findOne(where);
      } catch (error) {
        return error;
      }    
  }

  async getMedicineCategoryList(whereObj) {
    try {
      const result = await MedicineCategorySchema.aggregate([
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

module.exports = new MedicineCategoryModel();
