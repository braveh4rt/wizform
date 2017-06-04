/*wizform/views.js
 * This module create a form wizard status with a template
 *  based on https://bootsnipp.com/snippets/e3MBM
 *
 *
 *
 * Behaviours :
 *   On initialize will create a div as a region after #main-region with id #wizForm
 *   and create a region name wizFormRegion
 *
 *
 * Usage :
 * Require Backbone.js 1.3.3, marionetteJS v2.4.7, jquery 1.12.4
 * on a view
 *
 *   var wizForm = require("common/wizform/views");
 *   PicView.formWizardStep2 =  wizForm.Step.extend({
 *       createStep: function() {
 *             this.step = {
 *                 "step1": {"id":"1","label":"Basic info", "status":"complete"},
 *                 "step2": {"id":"2","label":"Upload Photos", "status":"active"},
 *                 "step3": {"id":"3","label":"Finish", "status":"disabled"},
 *             };
 *       },
 *
 * on a controller
 *        var formStep = new NewUploadView.formWizardStep2();
 *        AppManager.wizFormRegion.show(formStep);
 */
define(["app",
         "tpl!common/wizform/templates/number-wizard.tpl",
         "css!common/wizform/css/number-wizard",
         ], function(AppManager,formTpl){
  AppManager.module("Common.Wizform.Views", function (Views, AppManager, Backbone, Marionette, $, _){
    Views.Step = Marionette.ItemView.extend({
        template: formTpl,

        initialize: function(options){
            /**
             * @namespace
             * @property {object} step1            - The name of the input
             * @property {string} step1.id         - The step number displayed in a circle box
             * @property {string} step1.label      - The label of the step below circle box
             * @property {string} step1.status     - Status of the step. We have Active / Complete / Disabled status
             *
             */
            var defaultStep = {
                "step1": {"id":"1","label":"Basic info", "status":"complete"},
                "step2": {"id":"2","label":"Upload Photos", "status":"active"},
                "step3": {"id":"3","label":"Finish", "status":"disabled"},
            };

            /*
             * @property {object} mainRegion            - The Root DOM ID to be attached the wizform region
             * @property {object} wizRegion             - The name of the wizform to be used as ID in the DOM
             */
            var mainRegion = options.mainRegion || "#main-region";
            var wizRegion = options.wizRegion || "wizform";

            //create the region
            $(mainRegion).prepend( $("<div id='"+ wizRegion + "' class=''></div>"));//add wizform after breadcrumb
            AppManager.addRegions({
                wizFormRegion: "#wizform",
            });
            var options = options || {};

            //need for _ template to processing
            //the title of form
            this.title = options.title || "Form";
            this.step = options.step || defaultStep;


            //the step def will  be in createStep and apply user supplied step data
            if (this.createStep){
                this.createStep();
            }
        },

        /*modelEvents: {*/
            //"change": "modelUpdated"
        //},

        //modelUpdated: function(){

        /*},*/

        //pass it to template
        serializeData: function(){
            var self = this;
            original = Marionette.ItemView.prototype.serializeData.apply(this,arguments);
            _.extend(original, {
                "title": this.title,
                "step": this.step,
                "submit": this.submit,
            });
            return original;
        },

        //on the form show, process the input element and value if have
        onShow: function(options){
            //console.log("on show view will populate the input value");

            _.each(this.form, function(item){
                var self = this;
                //console.log("process the name ", item.name);
                var name = "input-"+item.name;
                this.$("#"+name).val(options.model.get(item.name));
                //console.log("the name is ", name + " :: " + this.$("#"+name).val());

                //process the label text value
                var name = "label-"+item.name;
                this.$("#"+name).text(options.model.get(item.name));
                });

            /*this.$(".wysihtml5").wysihtml5();*/

            //this.$(".date-picker").datepicker({
                //format: "yyyy-mm-dd",
                //startDate: "-3d"
            //});

            //this.$(".numeric").inputmask("integer",{
                //allowMinus: false,
                //allowPlus: true,
            //});

            ////set focus on first input element
            /*this.$el.find('input[type=text]:first').focus();*/
            if (this.afterOnShow){
                this.afterOnShow();
            }
        },

        ui: {
            "js_submit": "button.js-submit",
            "js_cancel": "button.js-cancel",
        },

        events: {
            "click @ui.js_submit": "submitClicked",
            "click @ui.js_cancel": "cancelClicked",
        },


        submitClicked: function(e){
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            //console.log("the data", data);
            this.trigger("form:submit", data);
            //disable button
            this.ui.js_submit.prop('disabled', true);
            //$('.js-submit').prop('disabled', true);
        },

        cancelClicked: function(e){
            //controller will go back to list view
            e.preventDefault();
            this.trigger("form:cancel");
        },

        //reset form value
        //call when save success
        resetForm: function(){
            var $view = this.$el;
            var $form = $view.find("form");
            $form.find(".form-control").each(function(){
                $(this).text="";
            });
            this.onFormDataInvalid();

            //this.ui.first_name.val("");
            var $form = $view.find("form");
            $form.find("input").each(function(){
                $(this).val("");
            });
            $form.find("textarea").each(function(){
                $(this).val("");
            });
            this.$(':input:visible:enabled:first').focus();
            this.ui.js_submit.prop('disabled', false);
        },

        //process the invalid form input
        onFormDataInvalid: function(errors){
            var $view = this.$el;
            var clearFormErrors = function(){
                var $form = $view.find("form");

                $form.find(".help-inline.error").each(function(){
                    $(this).remove();
                });
                $form.find(".control-group.error").each(function(){
                    $(this).removeClass("error");
                });
                $form.find(".col-md-4.has-error").each(function(){
                    $(this).removeClass("has-error");
                });
            }

            var markErrors = function(value, key){
                var $controlGroup = $view.find("#input-" + key).parent();
                var $errorEl = $("<span>",{ class: "help-inline error", text: value });
                $controlGroup.append($errorEl).addClass("has-error");
            }

            clearFormErrors();
            _.each(errors, markErrors);
        }
    });
  });
  return AppManager.Common.Wizform.Views;
});

