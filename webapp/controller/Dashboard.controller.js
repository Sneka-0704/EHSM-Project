sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {
        onInit: function () {
            // Check if user is logged in
            var oSessionModel = this.getOwnerComponent().getModel("session");
            if (!oSessionModel || !oSessionModel.getProperty("/IsLoggedIn")) {
                // If not logged in, redirect to login (optional, but good for direct URL access)
                this.getOwnerComponent().getRouter().navTo("RouteLogin");
            }
        },

        onPressRisk: function () {
            this.getOwnerComponent().getRouter().navTo("RouteRisk");
        },

        onPressIncident: function () {
            this.getOwnerComponent().getRouter().navTo("RouteIncident");
        },

        onLogout: function () {
            // Clear session
            this.getOwnerComponent().setModel(new JSONModel({}), "session");
            MessageToast.show("Logged out successfully");
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
        }
    });
});
