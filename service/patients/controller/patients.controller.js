const CONSTANTS = require('../../../config/constant');
const util = require('../../../utils/response');
const message = require('../../../utils/messages.json');
const patientsModel = require('../model/patients.model');
const appointmentsModel = require('../../appointments/model/appointments.model');
const moment = require("moment")
// const { ObjectId } = require('mongodb');
const { ObjectId } = require("mongoose").Types
const helper = require('../../../utils/helper');
const fileUpload = require('../../../utils/upload');


class PatientsHandler { 
  
  async patientsAdd(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    let unique_id = await patientsModel.countPatient({});
    unique_id = (unique_id+1).toString().padStart(5, '0')
    try {
      let insPatients = {
        // first_name: reqData.first_name,
        // middle_name: reqData.middle_name,
        // last_name: reqData.last_name,
        patient_name: reqData.patient_name,
        email: reqData.email,
        contact_person: reqData.contact_person,
        mobile: reqData.mobile,
        birth_date: reqData.birth_date ? new Date(reqData.birth_date) : null,
        age: reqData.age,
        gender: reqData.gender,
        country: reqData.country,
        state: reqData.state,
        city: reqData.city,
        taluka:reqData.taluka,
        address: reqData.address,
        adharcard_number: reqData.adharcard_number,
        unique_id: unique_id
      }

      let getAllUser = await patientsModel.createPatients(insPatients)

      return response.send(util.success(getAllUser, message.common_messages_record_added));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async patientsUpdate(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      if(!reqData._id){
        return response.send(util.error({}, message.user_id_empty));
      }else{
        let updUser = {};

        if(typeof reqData.patient_name != "undefined"){
          updUser.patient_name = reqData.patient_name;
        }

        /* if(typeof reqData.first_name != "undefined"){
          updUser.first_name = reqData.first_name;
        }
        
        if(typeof reqData.middle_name != "undefined"){
          updUser.middle_name = reqData.middle_name;
        }

        if(typeof reqData.last_name != "undefined"){
          updUser.last_name = reqData.last_name;
        } */

        if(typeof reqData.email != "undefined"){
          updUser.email = reqData.email;
        }

        if(typeof reqData.mobile != "undefined"){
          updUser.mobile = reqData.mobile;
        }

        if(typeof reqData.birth_date != "undefined"){
          updUser.birth_date = new Date(reqData.birth_date);
        }

        if(typeof reqData.age != "undefined"){
          updUser.age = reqData.age;
        }

        if(typeof reqData.gender != "undefined"){
          updUser.gender = reqData.gender;
        }

        if(typeof reqData.country != "undefined"){
          updUser.country = reqData.country;
        }

        if(typeof reqData.state != "undefined"){
          updUser.state = reqData.state;
        }

        if(typeof reqData.city != "undefined"){
          updUser.city = reqData.city;
        }
        
        if(typeof reqData.taluka != "undefined"){
          updUser.taluka = reqData.taluka;
        }

        if(typeof reqData.address != "undefined"){
          updUser.address = reqData.address;
        }

        if(typeof reqData.adharcard_number != "undefined"){
          updUser.adharcard_number = reqData.adharcard_number;
        }

        let getAllUser = await patientsModel.updatPatientById(updUser, {
          _id: new ObjectId(reqData._id)
        })
  
        return response.send(util.success({}, message.common_messages_record_updated));

      }

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }


  async patientsList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getAllUser = await patientsModel.getPatientsList({
        is_deleted:false
      });

      return response.send(util.success(getAllUser, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async patientsAppointmentList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let where = {
        is_deleted:false,
        patient_id: new ObjectId(reqData.patient_id),
      };

      if( typeof reqData.appointment_notin != "undefined"){
        where._id = { $nin: [new ObjectId(reqData.appointment_notin)]}
      }
      console.log(where, "where", reqData.patient_id)
      let appointmentList = await appointmentsModel.getAppointmentsList(where);
      
      if(appointmentList && appointmentList.length > 0){
        return response.send(util.success(appointmentList, message.common_messages_record_available));
      }else{
        return response.send(util.success([], message.common_messages_record_not_available));
      }      

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async getPatientData(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getAllUser = await patientsModel.getPatientOne({
        _id: new ObjectId(reqData.patient_id),
        // is_deleted:false
      });

      return response.send(util.success(getAllUser, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async deletePatient(request, response){
    let pId = request.params.id;
    let timestamp = new Date().getTime();
    try {
      if(pId){
        
        let getAllUser = await patientsModel.updatPatientById({
          is_deleted:true
        }, {
          _id: new ObjectId(pId),
        })
        return response.send(util.success(getAllUser, message.common_messages_record_deleted));
      }else{
        throw new Error('Patient id is empty')
      }
    } catch (err) {
      console.log(err);
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async deleteManyPatient(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {
      console.log({
        _id: reqData.ids.map((pid)=> new ObjectId(pid)),
      }, "-----")
      if(reqData.ids && Array.isArray(reqData.ids) && reqData.ids.length > 0){
        
        let getAllUser = await patientsModel.updateManyPatient({
          is_deleted:true
        }, {
          _id: {$in:reqData.ids.map((pid)=> new ObjectId(pid))},
        });
        console.log(getAllUser, "getAllUser")
        return response.send(util.success(getAllUser, message.common_messages_record_deleted));
      }else{
        throw new Error('Patient id is empty')
      }
    } catch (err) {
      console.log(err);
      return response.send(util.error({}, err.message || message.something_went_wrong));
    }
  }
}

module.exports = new PatientsHandler();