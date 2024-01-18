const medicineApi = require('./controller/medicine.controller');

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {
    this.app.post('/medicine/add', medicineApi.medicineAdd);
    this.app.post('/medicine/bulkAdd', medicineApi.medicineBulkAdd);
    this.app.post('/medicine/details', medicineApi.getMedicineData)
    this.app.post('/medicine/update', medicineApi.medicineUpdate);
    this.app.post('/medicine/list', medicineApi.medicineList);
    this.app.delete('/medicine/delete/:id', medicineApi.deleteMedicine);
    
    this.app.post('/medicine-category/add', medicineApi.medicineCategoryAdd);
    this.app.post('/medicine-category/details', medicineApi.getMedicineCategoryData)
    this.app.post('/medicine-category/update', medicineApi.medicineCategoryUpdate);
    this.app.post('/medicine-category/list-all', medicineApi.medicineCategoryList);
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
