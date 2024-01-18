const CONSTANTS = require('../../../config/constant');
const util = require('../../../utils/response');
const message = require('../../../utils/messages.json');
const medicineModel = require('../model/medicine.model');
const medicineCategoryModel = require('../model/medicine-category.model');

const moment = require("moment")
const { ObjectId } = require('mongodb');
const helper = require('../../../utils/helper');
const fileUpload = require('../../../utils/upload');


class MedicineHandler { 

  async medicineCategoryAdd(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    let unique_id = moment().format("YY MM DD HH mm ss");
    unique_id = unique_id.split(" ").join("");
    try {
      let insPatients = {
        name: reqData.name,
        description: reqData.description
      }

      let getAllUser = await medicineCategoryModel.createMedicineCategory(insPatients)

      return response.send(util.success(getAllUser, message.common_messages_record_added));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async medicineCategoryUpdate(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      if(!reqData._id){
        return response.send(util.error({}, message.user_id_empty));
      }else{
        let updCategory = {};

        if(typeof reqData.name != "undefined"){
          updCategory.name = reqData.name;
        }

        if(typeof reqData.description != "undefined"){
          updCategory.description = reqData.description;
        }

       
        let updRs = await medicineCategoryModel.updateMedicineCategoryById(updCategory, {
          _id: new ObjectId(reqData._id)
        });
  
        return response.send(util.success(updRs, message.common_messages_record_updated));

      }

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }


  async medicineCategoryList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getAllUser = await medicineCategoryModel.getMedicineCategoryList({
        is_deleted:false
      });

      return response.send(util.success(getAllUser, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async getMedicineCategoryData(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getAllUser = await medicineCategoryModel.getMedicineCategoryOne({
        _id: new ObjectId(reqData._id),
        is_deleted:false
      });

      return response.send(util.success(getAllUser, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async medicineAdd(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    let unique_id = moment().format("YY MM DD HH mm ss");
    unique_id = unique_id.split(" ").join("");
    try {
      let insPatients = {
        name: reqData.name,
        description: reqData.description,
        category_id: reqData.category_id ? new ObjectId(reqData.category_id) : null
      }

      let createMedicine = await medicineModel.createMedicine(insPatients)

      return response.send(util.success(createMedicine, message.common_messages_record_added));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async medicineBulkAdd(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {
      let insPatients = [
        {
          name: "Tablet Nifedipine Sustained Release 10 mg (Retard)",
          description: "Tablet Nifedipine Sustained Release 10 mg (Retard)",
          category_id: "646dff44772c868590b07b71"
        }
        
      ];
      let createMedicine = await medicineModel.createBulkMedicine(insPatients)

      return response.send(util.success(createMedicine, message.common_messages_record_added));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }


  async medicineUpdate(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      if(!reqData._id){
        return response.send(util.error({}, message.user_id_empty));
      }else{
        let updCategory = {};

        if(typeof reqData.name != "undefined"){
          updCategory.name = reqData.name;
        }

        if(typeof reqData.description != "undefined"){
          updCategory.description = reqData.description;
        }

        if(typeof reqData.category_id != "undefined"){
          updCategory.category_id = reqData.category_id;
        }

       
        let updRs = await medicineModel.updateMedicineById(updCategory, {
          _id: new ObjectId(reqData._id)
        });
  
        return response.send(util.success(updRs, message.common_messages_record_updated));

      }

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }


  async medicineList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getAllMedicine = await medicineModel.getMedicineList({
        is_deleted:false
      });

      return response.send(util.success(getAllMedicine, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async getMedicineData(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getRs = await medicineModel.getMedicineOne({
        _id: new ObjectId(reqData._id),
        is_deleted:false
      });

      return response.send(util.success(getRs, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async deleteMedicine(request, response){
    let medicineId = request.params.id;
    let timestamp = new Date().getTime();
    try {

      let getRs = await medicineModel.deleteMedicineById({
        _id: new ObjectId(medicineId),
        is_deleted:false
      });

      return response.send(util.success(getRs, message.common_messages_record_deleted));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }
}

module.exports = new MedicineHandler();