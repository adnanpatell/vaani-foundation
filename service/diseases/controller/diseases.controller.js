const CONSTANTS = require('../../../config/constant');
const util = require('../../../utils/response');
const message = require('../../../utils/messages.json');
const diseasesModel = require('../model/diseases.model');

const moment = require("moment")
const { ObjectId } = require('mongodb');
const helper = require('../../../utils/helper');
const fileUpload = require('../../../utils/upload');


class DiseasesHandler { 

  async diseasesAdd(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    let unique_id = moment().format("YY MM DD HH mm ss");
    unique_id = unique_id.split(" ").join("");
    try {
      let insDiseases = {
        name: reqData.name
      }

      let DiseasesRS = await diseasesModel.createDiseases(insDiseases)

      return response.send(util.success(DiseasesRS, message.common_messages_record_added));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async diseasesUpdate(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      if(!reqData._id){
        return response.send(util.error({}, message.user_id_empty));
      }else{
        let updDiseases = {};

        if(typeof reqData.name != "undefined"){
          updDiseases.name = reqData.name;
        }
  
        let DiseasesRS = await diseasesModel.updateDiseasesById(updDiseases, {
          _id: new ObjectId(reqData._id)
        })
  
        return response.send(util.success(DiseasesRS, message.common_messages_record_updated));

      }

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }


  async diseasesList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getAllDiseases = await diseasesModel.getDiseasesList({
        is_deleted:false
      });

      return response.send(util.success(getAllDiseases, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async getDiseasesData(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getRs = await diseasesModel.getPHcOne({
        _id: new ObjectId(reqData._id),
        is_deleted:false
      });

      return response.send(util.success(getRs, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }
}

module.exports = new DiseasesHandler();