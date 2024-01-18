const phcApi = require('./controller/phc.controller');

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {

    this.app.post('/phc/add', phcApi.PHcAdd);
    this.app.post('/phc/details', phcApi.getPHcData)
    this.app.post('/phc/update', phcApi.PHcUpdate);
    this.app.post('/phc/list', phcApi.PHcList);
    // this.app.post('/patients/delete', patientsApi.deleteUser);

  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
