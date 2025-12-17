sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, DateFormat, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("ehsm.controller.RiskAssessment", {

        formatter: {
            formatDate: function (sDate) {
                if (!sDate) {
                    return "";
                }
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "MMM dd, yyyy"
                });
                return oDateFormat.format(new Date(sDate));
            }
        },

        onInit: function () {
            // Get router and attach route matched handler
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RiskAssessment").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            // Verify user is logged in
            var oSessionModel = this.getOwnerComponent().getModel("session");
            var bIsLoggedIn = oSessionModel.getProperty("/isLoggedIn");

            if (!bIsLoggedIn) {
                MessageToast.show("Please login to access this page");
                this.getOwnerComponent().getRouter().navTo("Login");
                return;
            }

            // Load risk assessment data
            this._loadRiskData();
        },

        _loadRiskData: function () {
            var oTable = this.byId("riskTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                oTable.setBusy(true);
                oBinding.attachEventOnce("dataReceived", function (oEvent) {
                    oTable.setBusy(false);
                    var oData = oEvent.getParameter("data");
                    if (oData && oData.results) {
                        MessageToast.show("Loaded " + oData.results.length + " risk assessments");
                    }
                });

                oBinding.attachEventOnce("dataRequested", function () {
                    oTable.setBusy(true);
                });

                // Handle errors
                this.getOwnerComponent().getModel().attachMetadataFailed(function (oEvent) {
                    oTable.setBusy(false);
                    var oParams = oEvent.getParameters();
                    MessageBox.error("Failed to load risk assessment data: " + (oParams.message || "Unknown error"));
                });
            }
        },

        onRefresh: function () {
            var oTable = this.byId("riskTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                oTable.setBusy(true);
                oBinding.refresh();
                MessageToast.show("Refreshing risk assessment data...");
            }
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("Dashboard");
        }
    });
});
