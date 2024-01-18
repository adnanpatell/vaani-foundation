const CONSTANTS = require('../../../config/constant');
const util = require('../../../utils/response');
const message = require('../../../utils/messages.json');
const phcModel = require('../model/phc.model');

const moment = require("moment")
const { ObjectId } = require('mongodb');
const helper = require('../../../utils/helper');
const fileUpload = require('../../../utils/upload');


class PHcsHandler { 

  async PHcAdd(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    let unique_id = moment().format("YY MM DD HH mm ss");
    unique_id = unique_id.split(" ").join("");
    try {
      
      let insPHc = {
        name: reqData.name,
        phc_number: reqData.phc_number,
        address: reqData.address,
        streamSettings: reqData.streamSettings && Array.isArray(reqData.streamSettings) ? reqData.streamSettings : []
      }

      let PHcRS = await phcModel.createPHc(insPHc)

      return response.send(util.success(PHcRS, message.common_messages_record_added));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async PHcUpdate(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      if(!reqData._id){
        return response.send(util.error({}, message.user_id_empty));
      }else{
        let updUser = {};

        if(typeof reqData.name != "undefined"){
          updUser.name = reqData.name;
        }

        if(typeof reqData.phc_number != "undefined"){
          updUser.phc_number = reqData.phc_number;
        }

        if(typeof reqData.address != "undefined"){
          updUser.address = reqData.address;
        }

        if(typeof reqData.streamSettings != "undefined"){
          updUser.streamSettings = reqData.streamSettings;
        }
  
        let PHcRS = await phcModel.updatePHcById(updUser, {
          _id: new ObjectId(reqData._id)
        })
  
        return response.send(util.success(PHcRS, message.common_messages_record_updated));

      }

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }


  async PHcList(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getAllPHc = await phcModel.getPHcList({
        is_deleted:false
      });

      return response.send(util.success(getAllPHc, message.common_messages_record_available));

    } catch (err) {
      console.log(err)
      return response.send(util.error({}, message.something_went_wrong));
    }
  }

  async getPHcData(request, response){
    let reqData = request.body;
    let timestamp = new Date().getTime();
    try {

      let getRs = await phcModel.getPHcOne({
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

module.exports = new PHcsHandler();