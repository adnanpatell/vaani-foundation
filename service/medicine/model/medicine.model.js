"use strict";
const MedicineSchema = require("./medicine.schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//const CONSTANTS = require('../../../config/constant');
const CC = require("./../../../config/constant_collection");
const logger = require("./../../../config/winston");
const jwt = require("jsonwebtoken");


class MedicineModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }


  async createMedicine(patientsData) {
    try {
      let patients = new MedicineSchema(patientsData);
      const result = await patients.save();
      return result;
    } catch (error) {
      return error;
    }
  }

  async createBulkMedicine(patientsData) {
    try {
      
      const result = await MedicineSchema.insertMany(patientsData);
      return result;
    } catch (error) {
      return error;
    }
  }

  async updateMedicineById(updObj, where) {    
    try {
      return await MedicineSchema.updateOne({ _id: new ObjectId(where["_id"]) }, { $set: updObj });        
    } catch (error) {
      console.log(error);
      return error;
    }    
  }

  async getMedicineOne(where) {    
      try {
        return await MedicineSchema.findOne(where);
      } catch (error) {
        return error;
      }    
  }

  async getMedicineList(whereObj) {
    try {
      const result = await MedicineSchema.aggregate([
        {
          $match:whereObj
        },
        {
          $lookup: {
            from: CC.M001_MEDICINE_CATEGORIES,
            localField: "category_id",
            foreignField: "_id",
            as: "categoryData"
          }
        },
        {
          $unwind:{
            path: "$categoryData",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteMedicineById(where) {    
    try {
      return await MedicineSchema.deleteOne(where);
    } catch (error) {
      return error;
    }    
  }
}

module.exports = new MedicineModel();
