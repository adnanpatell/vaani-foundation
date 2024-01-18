"use strict";
const UserSchema = require("./user.schema");
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

  getUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ email: email, is_deleted: false });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserByEmailOrMobile(reqData) {
    let where = {};
    if(reqData && reqData.email && reqData.email != ""){
      where.email = reqData.email.trim().toLowerCase();
    }else if(reqData && reqData.mobile && reqData.mobile != "" && reqData.country_code && reqData.country_code != ""){
      where.mobile = reqData.mobile.trim();
      where.country_code = reqData.country_code.trim();
    }else{
      return null;
    }
    return new Promise(async (resolve, reject) => {
      try {
        where.is_deleted = false;
        const result = await UserSchema.findOne(where);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserByMobile(mobile) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ mobile: mobile,is_deleted: false});
        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }


  async createUser(user_data) {
    try {
      let user = new UserSchema(user_data);
      const result = await user.save();
      return result;
    } catch (error) {
      console.log(error, "error ")
      return error;
    }
  }

  async updateToken(user_id, token) {
    try {
      let result = await UserSchema.updateMany(
        { _id: user_id },
        { $set: { token: token } }
      );
      return result;
    } catch (error) {
      return error;
    }
  }


  async getUserByToken(token) {    
      try {
        return await UserSchema.findOne({ token: token, is_deleted: false });
      } catch (error) {
        return error;
      }    
  }

  /*
   * Name of the Method : updateUser
   * Description : update User details
   */
  async updateUserById(updObj, where) {    
      try {
        return await UserSchema.updateOne({ _id: new ObjectId(where["_id"]) }, { $set: updObj });        
      } catch (error) {
        console.log(error);
        return error;
      }    
  }

  

  /*
   * Name of the Method : findUserByToken
   * Description : get user by token
   */
  findUserByToken(token) {
    
    const secret = process.env.JWT_SECRET;
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, secret, async (err, decode) => {
        if (err) return reject(err);
        if (decode.user) {
          const user_id = decode.user;
          try {
            let userRs = await UserSchema.findOne({ _id: new ObjectId(user_id), "token": token, is_deleted: false });
            resolve(userRs);
            return;
          } catch (error) {
            reject(error);
          }          
        }
        reject(decode);
        return;
      });
    });
  }


  // This mathod is used for get profile

  getUserProfile(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ _id: new ObjectId(userId),is_deleted: false});
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserById(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ _id: new ObjectId(userId),is_deleted: false});
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserByReferralCode(refCode) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ referral_code: refCode,is_deleted: false});
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAgentByReferralCode(refCode) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ agent_code: refCode,is_agent: true, is_deleted:false});
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getUsersList(whereObj) {
    try {
      const result = await UserSchema.aggregate([
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
          $lookup: {
            from: CC.PH01_PHCS,
            localField: "phcid",
            foreignField: "_id",
            as: "phcData"
          }
        },
        {
          $unwind:{
            path:"$roleData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind:{
            path:"$phcData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project:{
            first_name: 1,
            last_name: 1,
            middle_name: 1,
            email: 1,
            mobile: 1,
            password: 1,
            phcid: 1,
            role: 1,
            status: 1,
            is_deleted: 1,
            createdAt: 1,
            "roleData.name": 1,
            "roleData.role": 1,
            "roleData.is_default": 1,
            "roleData.is_visible": 1,
            "roleData.access": 1,
            "phcData.name":1,
            "phcData.phc_number":1,
            "phcData.address":1
          }
        }
      ]);
      return result;
    } catch (error) {
      return error;
    }
  }

  
  getAllUserEmail(where){
    return new Promise(async (resolve, reject) => {
			try {
				const result = await UserSchema.find(where,{
          _id:1,
          email:1
        });
				resolve(result);
			} catch (error) {
				console.log(error);
				reject(error)
			}
		});
  }
  
}

module.exports = new UserModel();
