const appointmentsApi = require('./controller/appointments.controller');

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {

    this.app.post('/appointments/add', appointmentsApi.appointmentsAdd);
    this.app.post('/appointments/details', appointmentsApi.getAppointmentsData)
    this.app.post('/appointments/update', appointmentsApi.appointmentsUpdate);
    this.app.post('/appointments/list', appointmentsApi.appointmentsList);
    this.app.post('/appointments/role_according', appointmentsApi.completedAppointmentsList);

    this.app.post('/appointments/statistics', appointmentsApi.appointmentsStatistics);
    // this.app.post('/patients/delete', patientsApi.deleteUser);

  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
