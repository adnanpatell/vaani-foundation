const diseasesApi = require('./controller/diseases.controller');

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {

    this.app.post('/diseases/add', diseasesApi.diseasesAdd);
    this.app.post('/diseases/details', diseasesApi.getDiseasesData)
    this.app.post('/diseases/update', diseasesApi.diseasesUpdate);
    this.app.post('/diseases/list', diseasesApi.diseasesList);
    // this.app.post('/patients/delete', patientsApi.deleteUser);

  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
