const userModel = require("../../service/user/model/user.model");
const roleModel = require("../../service/user/model/user_role.model");
const phcModel = require("../../service/phc/model/phc.model")
const jwt = require("jsonwebtoken");

// this function authorization token
const auth = async function (authorization, next) {
  try {    
    const userResult = await userModel.findUserByToken(authorization);
    if (!userResult) {
      const error = new Error("can't access");
      throw error.message;
    }

    let uRs = {
      ...userResult._doc,
    }
    let roleData = await roleModel.getRoleByRoleKey({_id:userResult.role, is_deleted: false});
    uRs.roleData = roleData;
    if(userResult.phcid){
      uRs.phcData = await phcModel.getPHcOne({_id:userResult.phcid})
    }else{
      uRs.phcData = {};
    }
    

    return next(null, uRs);
  } catch (error) {
    next(error, null);
  }
};

// this function check unrestricted urls.
const checkUrl = async function (url) {
  const urls = ["/login", "/register", "/user_details/token", "/logout"];

  if (typeof url !== "string") return false;
  return urls.includes(url);
};

// this function check customheader
const customHeaderChecker = async (customHeader, next) => {
  const secret = process.env.CUSTOM_SECRET;
  const custom_header = process.env.CUSTOM_HEADER;
  jwt.verify(customHeader, secret, (err, decode) => {
    if (err) return next({ error: true }, { success: false });
    if (decode === custom_header) {
      next({ error: false }, { success: true });
    } else {
      next({ error: true }, { success: false });
    }
  });
};

module.exports = { auth, checkUrl, customHeaderChecker };
