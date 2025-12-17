sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], function (Controller, JSONModel, MessageBox, MessageToast, BusyIndicator) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {

        onInit: function () {
            // Initialize login model
            var oLoginModel = new JSONModel({
                userId: "",
                password: ""
            });
            this.getView().setModel(oLoginModel, "loginModel");
        },

        onLogin: function () {
            var oView = this.getView();
            var oLoginModel = oView.getModel("loginModel");
            var sUserId = oLoginModel.getProperty("/userId");
            var sPassword = oLoginModel.getProperty("/password");

            // Validate input
            if (!sUserId || !sPassword) {
                MessageBox.error("Please enter both User ID and Password.");
                return;
            }

            // Show busy indicator
            BusyIndicator.show(0);

            // Get OData model
            var oDataModel = this.getOwnerComponent().getModel();

            // Read login entity set with filters
            var aFilters = [
                new sap.ui.model.Filter("user_id", sap.ui.model.FilterOperator.EQ, sUserId),
                new sap.ui.model.Filter("password", sap.ui.model.FilterOperator.EQ, sPassword)
            ];

            oDataModel.read("/Z898_LOGIN", {
                filters: aFilters,
                success: function (oData) {
                    BusyIndicator.hide();

                    // Check if credentials are valid
                    if (oData.results && oData.results.length > 0) {
                        // Login successful
                        var oSessionModel = this.getOwnerComponent().getModel("session");
                        oSessionModel.setProperty("/userId", sUserId);
                        oSessionModel.setProperty("/isLoggedIn", true);

                        MessageToast.show("Login successful! Welcome, " + sUserId);

                        // Clear login form
                        oLoginModel.setProperty("/userId", "");
                        oLoginModel.setProperty("/password", "");

                        // Navigate to Dashboard
                        this.getOwnerComponent().getRouter().navTo("Dashboard");
                    } else {
                        // Login failed
                        MessageBox.error("Invalid User ID or Password. Please try again.");
                    }
                }.bind(this),
                error: function (oError) {
                    BusyIndicator.hide();
                    var sErrorMsg = "Login failed. Please check your credentials and try again.";

                    // Try to parse error message
                    if (oError.responseText) {
                        try {
                            var oErrorResponse = JSON.parse(oError.responseText);
                            if (oErrorResponse.error && oErrorResponse.error.message && oErrorResponse.error.message.value) {
                                sErrorMsg = oErrorResponse.error.message.value;
                            }
                        } catch (e) {
                            // Use default error message
                        }
                    }

                    MessageBox.error(sErrorMsg);
                }.bind(this)
            });
        }
    });
});
