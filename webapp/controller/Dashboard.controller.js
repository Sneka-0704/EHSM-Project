sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {

        onInit: function () {
            // Check if user is logged in
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Dashboard").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            // Verify user is logged in
            var oSessionModel = this.getOwnerComponent().getModel("session");
            var bIsLoggedIn = oSessionModel.getProperty("/isLoggedIn");

            if (!bIsLoggedIn) {
                // Redirect to login if not logged in
                MessageToast.show("Please login to access the dashboard");
                this.getOwnerComponent().getRouter().navTo("Login");
            }
        },

        onNavigateToRiskAssessment: function () {
            this.getOwnerComponent().getRouter().navTo("RiskAssessment");
        },

        onNavigateToIncidentManagement: function () {
            this.getOwnerComponent().getRouter().navTo("IncidentManagement");
        },

        onLogout: function () {
            // Clear session
            var oSessionModel = this.getOwnerComponent().getModel("session");
            oSessionModel.setProperty("/userId", "");
            oSessionModel.setProperty("/isLoggedIn", false);

            MessageToast.show("Logged out successfully");

            // Navigate to login
            this.getOwnerComponent().getRouter().navTo("Login");
        }
    });
});
