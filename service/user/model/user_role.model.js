'use strict';
const roleSchema = require("./user_role.schema");
const roleKeysSchema = require("./user_role_keys.schema");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const CC = require("./../../../config/constant_collection");

class ulroleModel {

	constructor() {
		this.DB = require("../../../config/dbm");
		this.projectedKeys = {
			"crtd_dt": true
		};
	}

	/*
	* Name of the Method : Create Custome Role
	* Description : add new role
	*/
	async createRole(insertData) {
		try {
			let role = new roleSchema(insertData);
			return await role.save();			
		} catch (error) {
			return error;
		}		
	}

	/*user Licences update role */
	async updateRole(setObj,whereObj){
		try {
			return await roleSchema.updateOne(whereObj, { $set: setObj });
		} catch (error) {
			return error;
		}
	}

	/* Get Access Keys */
	async getRoleKeys(whereObj) {
		try {
			const result = await roleKeysSchema.findOne(whereObj).lean();
			return result;
		} catch (error) {
			return error;
		}
	}

	async checkExistRole(whereObj){		
		try {
			return await roleSchema.find(whereObj).lean();				
		} catch (error) {
			return error;
		}		
	}

	async getRoleById(whereObj){		
		try {
			return await roleSchema.findOne(whereObj).lean();
		} catch (error) {
			return error;
		}		
	}

	async getRoleByKeys(whereObj) {
		try {
			const result = await roleSchema.aggregate([
				{
					$match: whereObj
				}
			]);
			return result;

		} catch (error) {
			return error;
		}
		
	}

	async getUsersByRoleId(whereObj){
		try {
			return await userLicencesUsersSchema.find(whereObj).lean();
		} catch (error) {
			return error;
		}
	}

	async getRoleByRoleKey(whereObj){		
		try {
			return await roleSchema.findOne(whereObj).lean();
		} catch (error) {
			return error;
		}		
	}


	async getRoleAccessKeys(whereObj){
		try {
			return await roleKeysSchema.find(whereObj).lean();
		} catch (error) {
			return error;
		}
	}
}

module.exports = new ulroleModel();