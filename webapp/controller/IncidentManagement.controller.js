sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState"
], function (Controller, DateFormat, MessageBox, MessageToast, ValueState) {
    "use strict";

    return Controller.extend("ehsm.controller.IncidentManagement", {

        formatter: {
            formatDate: function (sDate) {
                if (!sDate) {
                    return "";
                }
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "MMM dd, yyyy"
                });
                return oDateFormat.format(new Date(sDate));
            },

            formatIncidentStatus: function (sStatus) {
                if (!sStatus) {
                    return ValueState.None;
                }
                switch (sStatus.toUpperCase()) {
                    case "OPEN":
                        return ValueState.Warning;
                    case "CLOSED":
                        return ValueState.Success;
                    case "IN PROGRESS":
                    case "IN_PROGRESS":
                        return ValueState.Information;
                    default:
                        return ValueState.None;
                }
            }
        },

        onInit: function () {
            // Get router and attach route matched handler
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("IncidentManagement").attachPatternMatched(this._onRouteMatched, this);
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

            // Load incident data
            this._loadIncidentData();
        },

        _loadIncidentData: function () {
            var oTable = this.byId("incidentTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                oTable.setBusy(true);
                oBinding.attachEventOnce("dataReceived", function (oEvent) {
                    oTable.setBusy(false);
                    var oData = oEvent.getParameter("data");
                    if (oData && oData.results) {
                        MessageToast.show("Loaded " + oData.results.length + " incidents");
                    }
                });

                oBinding.attachEventOnce("dataRequested", function () {
                    oTable.setBusy(true);
                });

                // Handle errors
                this.getOwnerComponent().getModel().attachMetadataFailed(function (oEvent) {
                    oTable.setBusy(false);
                    var oParams = oEvent.getParameters();
                    MessageBox.error("Failed to load incident data: " + (oParams.message || "Unknown error"));
                });
            }
        },

        onRefresh: function () {
            var oTable = this.byId("incidentTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                oTable.setBusy(true);
                oBinding.refresh();
                MessageToast.show("Refreshing incident data...");
            }
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("Dashboard");
        }
    });
});
