const patientsApi = require('./controller/patients.controller');

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {

    this.app.post('/patients/add', patientsApi.patientsAdd);
    this.app.post('/patients/details', patientsApi.getPatientData)
    this.app.post('/patients/update', patientsApi.patientsUpdate);
    this.app.post('/patients/listAll', patientsApi.patientsList);
    this.app.delete('/patients/delete/:id', patientsApi.deletePatient);
    this.app.post('/patients/delete', patientsApi.deleteManyPatient);
    this.app.post('/patients/appointments', patientsApi.patientsAppointmentList);

  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
