const userApi = require('./controller/user.controller');
const userRoleApi = require('./controller/user_role.controller');
const Stream = require('node-rtsp-stream');
class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {

    //Routes of userController
    this.app.post('/login', userApi.login);
    this.app.get("/auth", userApi.auth)
    this.app.post('/user_details/token', userApi.getUserDetailsByToken);
    this.app.post('/logout', userApi.logoutUser);

    this.app.get("/feed",(req, res)=>{
      const stream = new Stream({
        name: 'name',
        streamUrl: 'rtsp://admin:Admin@123@103.240.78.100:554/ cam/realmonitor?channel=1&subtype=1',
        wsPort: 3001,
        ffmpegOptions: { // options ffmpeg flags
          '-stats': '', // an option with no neccessary value uses a blank string
          '-r': 30 // options with required values specify the value after the key
        }
      });
      // console.log(stream, "stream")
      stream.start();
      // res.send(stream);
    })

    // Forgot password
    this.app.post('/forgot_password_request', userApi.forgotPasswordRequest);
    this.app.post('/forgot_password_otp_verify', userApi.forgotPasswordOtpVerify);
    this.app.post('/forgot_password/reset', userApi.forgotPasswordNewPassword);

    // Verify user email
    this.app.post('/user/registration_email_verify', userApi.registration_email_verify);
    this.app.post('/user/email_verify_process', userApi.email_verify_process);

    // User profile
    
    this.app.post('/user/change_password', userApi.userChangePassword);
    
    this.app.post('/user/profile/image', userApi.userProfileImage);

    this.app.post('/user/add', userApi.userAdd);
    this.app.post('/user/update', userApi.userUpdate);
    this.app.post('/user/listAll', userApi.userList);
    this.app.post('/user/delete', userApi.deleteUser);


    /* User Role */
    this.app.post('/user/role/add', userRoleApi.manageRole);
    this.app.post('/user/role/listAll', userRoleApi.listAll);

    this.app.get('/user/role/access_keys', userRoleApi.getRoleAccessKeys);

  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
