sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, MessageToast, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
            // Local model for login form
            var oLoginModel = new JSONModel({
                EmployeeId: "",
                Password: ""
            });
            this.getView().setModel(oLoginModel, "loginForm");

            // Bind the view inputs to this local model
            this.byId("inpEmployeeId").bindValue("loginForm>/EmployeeId");
            this.byId("inpPassword").bindValue("loginForm>/Password");
        },

        onLogin: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oRouter = this.getOwnerComponent().getRouter();
            var oLoginData = this.getView().getModel("loginForm").getData();
            var sEmployeeId = oLoginData.EmployeeId;
            var sPassword = oLoginData.Password;

            if (!sEmployeeId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password.");
                return;
            }

            // Show busy indicator
            sap.ui.core.BusyIndicator.show();

            // Calling OData Service /Z898_LOGIN
            // Assuming it is a Function Import or we read specific entity key
            // Based on requirement "calling /Z898_LOGIN"

            oModel.callFunction("/Z898_LOGIN", {
                method: "GET",
                urlParameters: {
                    EmployeeId: sEmployeeId,
                    Password: sPassword
                },
                success: function (oData, response) {
                    sap.ui.core.BusyIndicator.hide();
                    // Check Status (assuming response contains Status field based on req)
                    // adjust 'Z898_LOGIN' object wrapper if necessary
                    var oResult = oData.Z898_LOGIN || oData;

                    if (oResult.Status === "Success") {
                        MessageToast.show("Login Successful");

                        // Store session data
                        var oSessionModel = new JSONModel({
                            EmployeeId: sEmployeeId,
                            IsLoggedIn: true
                        });
                        this.getOwnerComponent().setModel(oSessionModel, "session");

                        // Navigate to Dashboard
                        oRouter.navTo("RouteDashboard");
                    } else {
                        MessageBox.error("Login Failed: " + (oResult.Message || "Invalid Credentials"));
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("System Error: Unable to login.");
                }
            });
        }
    });
});
