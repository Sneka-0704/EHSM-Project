sap.ui.define([
    "sap/ui/core/UIComponent",
    "ehsm/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("ehsm.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // initialize session model
            var oSessionModel = new sap.ui.model.json.JSONModel({
                userId: "",
                isLoggedIn: false
            });
            this.setModel(oSessionModel, "session");

            // enable routing
            this.getRouter().initialize();
        }
    });
});