# wizform

 This module create a form wizard status with a template
 based on https://bootsnipp.com/snippets/e3MBM



 Behaviours :

   On initialize will create a div as a region after #main-region with id #wizForm
   and create a region name wizFormRegion


 Usage :
 
 Require Backbone.js 1.3.3, marionetteJS v2.4.7, jquery 1.12.4
 on a view.js

   '''
   var wizForm = require("common/wizform/views");
   PicView.formWizardStep2 =  wizForm.Step.extend({
       createStep: function() {
             this.step = {
                 "step1": {"id":"1","label":"Basic info", "status":"complete"},
                 "step2": {"id":"2","label":"Upload Photos", "status":"active"},
                 "step3": {"id":"3","label":"Finish", "status":"disabled"},
             };
       },
   '''
 on a controller

    '''
        var formStep = new NewUploadView.formWizardStep2();
        AppManager.wizFormRegion.show(formStep);
    '''
