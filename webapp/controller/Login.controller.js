sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, JSONModel, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
            // Local model for login form
            var oLoginModel = new JSONModel({
                user_id: "",
                password: ""
            });
            this.getView().setModel(oLoginModel, "loginForm");

            // Bind the view inputs to this local model
            this.byId("inpUserId").bindValue("loginForm>/user_id");
            this.byId("inpPassword").bindValue("loginForm>/password");
        },

        onLogin: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oRouter = this.getOwnerComponent().getRouter();
            var oLoginData = this.getView().getModel("loginForm").getData();
            var sUserId = oLoginData.user_id;
            var sPassword = oLoginData.password;

            if (!sUserId || !sPassword) {
                MessageToast.show("Please enter both User ID and Password.");
                return;
            }

            // Show busy indicator
            sap.ui.core.BusyIndicator.show();

            // Read Z898_LOGIN entity set and filter by user_id and password
            var sPath = "/Z898_LOGIN";
            var aFilters = [
                new Filter("user_id", FilterOperator.EQ, sUserId),
                new Filter("password", FilterOperator.EQ, sPassword)
            ];

            oModel.read(sPath, {
                filters: aFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    // Check if any results returned (successful login)
                    if (oData.results && oData.results.length > 0) {
                        MessageToast.show("Login Successful");

                        // Store session data
                        var oSessionModel = new JSONModel({
                            user_id: sUserId,
                            IsLoggedIn: true
                        });
                        this.getOwnerComponent().setModel(oSessionModel, "session");

                        // Navigate to Dashboard
                        oRouter.navTo("RouteDashboard");
                    } else {
                        MessageBox.error("Login Failed: Invalid User ID or Password");
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("System Error: Unable to login. Please check your connection.");
                }
            });
        }
    });
});
