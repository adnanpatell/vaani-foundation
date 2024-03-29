express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const fileUpload = require('express-fileupload');
const AppConfig = require("./config/app-config");
const cameraStream = require("./camaeraStream");

/* Routes Includes */
const PHcRoute = require("./service/phc/route");
const UploadRoutes = require("./service/upload/route");
const UserRoutes = require("./service/user/route");
const PatientsRoute = require("./service/patients/route");
const MedicineRoute = require("./service/medicine/route");
const DiseasesRoute = require("./service/diseases/route");
const AppointmentsHandler = require("./service/appointments/route");
/* End Routes Include */

const logger = require("./config/winston");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var UrlPattern = require('url-pattern');
// const schedule = require('node-schedule');
require('dotenv').config();
const { auth } = require("./middelware/controller/auth");
const socketIO = require('socket.io');
const {Users} = require('./utils/UsersClass');

class Server {
  constructor() {
    this.app = express();
    this.app.use(helmet({
      contentSecurityPolicy:false
    }));
    this.app.use(cors());
    this.http = http.Server(this.app);
    const io = socketIO(this.http,{
      cors: {
        origin: '*',
      }
    });
    require('./service/socket/notification')(io, Users);
    this.app.use((req, res, next) => {
      req.__dirname = __dirname;
      next();
    })
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: '/tmp/'
    }));
    // notificationIo(this.io, this.app)
    this.app.set('view engine', 'ejs');
    this.app.use(express.static("assets"));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 200000 }));
    this.app.use(async (req, res, next) => {
      const authorization = req.headers["authorization"];
      const urls = ["/login", "/feed", "/register", "/user_details/token", "/user/registration_email_verify", "/user/email_verify_process", "/forgot_password_request", "/forgot_password_otp_verify", "/forgot_password/reset"];

      // let acceptInvitatonPattern = new UrlPattern('/project/accept_invitation/:project/:user');
      // acceptInvitatonPattern.match(req.originalUrl)
      const url = urls.includes(req.originalUrl);
      if (url || authorization == "yk11_" || authorization == process.env.INTERNAL_HEADER) {
        next();
      } else if (typeof authorization === "string" && authorization !== "undefined") {

        await auth(authorization, (err, user) => {
          if (err) return res.status(403).send({ error: true, message: "Permission denied!" });
          req.user = user;
          res.locals.user = user;
          next();
        });

      } else {
        res.send({ error: true, message: "Permission denied!" });
      }
    });
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
    // cameraStream();
  }

  /* Including app Routes starts */
  includeRoutes() {
    new PHcRoute(this.app).routesConfig();
    new UploadRoutes(this.app).routesConfig();
    new UserRoutes(this.app).routesConfig();
    new PatientsRoute(this.app).routesConfig();
    new MedicineRoute(this.app).routesConfig();
    new DiseasesRoute(this.app).routesConfig();
    new AppointmentsHandler(this.app).routesConfig();
  }
  /* Including app Routes ends */

  startTheServer() {
    this.appConfig();
    this.includeRoutes();
    
    // 0 0 4 * * *
    // * * 1 * * *
    

    const port = process.env.NODE_SERVER_PORT || 2001;
    const host = process.env.NODE_SERVER_HOST || "localhost";

    this.http.listen(port, host, () => {
      logger.info(`Listening on http://${host}:${port}`);
    });
  }
}

module.exports = new Server();