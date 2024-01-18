const CONSTANTS = require('../../../config/constant');
const util = require('../../../utils/response');
const message = require('../../../utils/messages.json');
const appointmentsModel = require('../model/appointments.model');
const roleModel = require("../../user/model/user_role.model");

const moment = require("moment")
const { ObjectId } = require('mongodb');
const helper = require('../../../utils/helper');
const fileUpload = require('../../../utils/upload');


class AppointmentsHandler { 

  async appointmentsAdd(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    /* let unique_id = moment().format("YY MM DD HH mm ss");
    unique_id = unique_id.split(" ").join(""); */
    let appointment_id = await appointmentsModel.coundAppointment({phcid: request.user.phcid, createdAt:{$gte: new Date(moment().format("YYYY-MM-DD"))}});
    
    appointment_id = moment().format("YYYY-MM-DD")+"/"+(appointment_id+1);
    try {
      let insAppointments = {
        patient_id: reqData.patient_id,
        phcid: request.user.phcid,
        doctor_id: reqData.doctor_id,
        complains: reqData.complains,
        history: reqData.history,
        appointment_id: appointment_id,
        disease_id: reqData.disease_id ? new ObjectId(reqData.disease_id) : null
      }

      let appointmentsRS = await appointmentsModel.createAppointments(insAppointments)
      
      return response.send(util.success(appointmentsRS, message.common_messages_record_added));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async appointmentsUpdate(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      if(!reqData._id){
        return response.send(util.error({}, message.user_id_empty));
      }else{
        let updUser = {};

        if(typeof reqData.patient_id != "undefined"){
          updUser.patient_id = reqData.patient_id;
        }

        if(typeof reqData.doctor_id != "undefined"){
          updUser.doctor_id = reqData.doctor_id;
        }

        if(typeof reqData.complains != "undefined"){
          updUser.complains = reqData.complains;
        }

        if(typeof reqData.history != "undefined"){
          updUser.history = reqData.history;
        }

        if(typeof reqData.status != "undefined"){
          updUser.status = reqData.status;
        }

        if(typeof reqData.doctors_remark != "undefined"){
          updUser.doctors_remark = reqData.doctors_remark;
        }

        if(typeof reqData.lab_reports != "undefined"){
          updUser.lab_reports = reqData.lab_reports;
        }

        if(typeof reqData.medicine != "undefined"){
          updUser.medicine = reqData.medicine;
        }

        if(typeof reqData.disease_id != "undefined"){
          updUser.disease_id = reqData.disease_id;
        }
  
        let PHcRS = await appointmentsModel.updateAppointmentsById(updUser, {
          _id: new ObjectId(reqData._id)
        })
  
        return response.send(util.success(PHcRS, message.common_messages_record_updated));

      }

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }


  async appointmentsList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();

    let userRole = await roleModel.getRoleByRoleKey({_id:request.user.role});
    
    try {
      let where = {is_deleted:false};
      if(userRole.role == 'pharmacy_receptionist') {
        where.status = { $in: ["Pending", "Pharmacy"]};
        where.phcid = request.user.phcid;
      }else if(userRole.role == 'lab_person'){
        where.status = "Lab";
        where.phcid = request.user.phcid;
      }else if(userRole.role == 'doctor'){
        where.status = { $in: ["Doctor", "Pharmacy", "Lab"]};
        where.doctor_id = request.user._id;
        where.phcid = request.user.phcid;
      }else if(userRole.role == 'pharmacist'){
        where.status = { $in: ["Pharmacy"]};
        where.phcid = request.user.phcid;
      }else if(userRole.role == 'admin'){
        where.status = { $ne: "Complete"};
        where.phcid = request.user.phcid;
      } else if(userRole.role == 'receptionist'){
        where.status = { $in: ["Pending"]};
        where.phcid = request.user.phcid;
      } else if(userRole.role == 'super_admin'){
        where.status = { $ne: "Complete"};
      }
      
      let getAllPHc = await getAppointmentList(where);

      return response.send(util.success(getAllPHc, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async completedAppointmentsList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();

    let userRole = await roleModel.getRoleByRoleKey({_id:request.user.role});
    
    try {
      let where = {is_deleted:false};

      if(request.body.completed === true) where.status = { $eq: "Complete"};
      if(request.body.pending === true) where.status = { $eq: "Pending"};

      if(userRole.role != 'super_admin'){
        where.phcid = request.user.phcid;
      }
      
      let getAllPHc = await getAppointmentList(where);

      return response.send(util.success(getAllPHc, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async getAppointmentsData(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getRs = await appointmentsModel.getAppointmentsOne({
        _id: new ObjectId(reqData._id),
        is_deleted:false
      });

      return response.send(util.success(getRs, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async appointmentsStatistics(request, response){
    try {
      
      let last12Month = moment(new Date()).subtract(12,"months").format("YYYY-MM-DD");
      
      let mArr = [];
      let csDate = new Date(last12Month);
      while(csDate < new Date(moment(new Date()).format("YYYY-MM-DD"))){
        csDate = new Date(moment(csDate).add(1, "month").format("YYYY-MM-DD"))
        mArr.push(moment(csDate).format('MM-YYYY'));
      }
      
      let where = { is_deleted:false };
      
      where.createdAt = {$gte:new Date(last12Month)}
      let getAllPHc = await appointmentsModel.getAppointmentsForStatistics(where);
      let rsData = [];

      if(getAllPHc && getAllPHc.length > 0){
        mArr.forEach((m)=>{
          let check = getAllPHc.find((mv)=> mv._id === m);
          if(!check) rsData.push({_id:m,visits:0});
          else rsData.push({...check});

        })
      }
      
      return response.send(util.success(rsData, message.common_messages_record_available));
    } catch (err) {
      console.log(err);
      return response.send(util.error({}, message.something_went_wrong));
    }
  }
}

const getAppointmentList = async (where) => {
  let getAllPHc = await appointmentsModel.getAppointmentsList(where);
  return getAllPHc;
}

module.exports = new AppointmentsHandler();