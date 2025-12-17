sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("ehsm.controller.IncidentManagement", {
        formatter: {
            statusState: function (sStatus) {
                if (sStatus === "CLOSED") {
                    return "Success";
                } else if (sStatus === "OPEN") {
                    return "Error";
                } else if (sStatus === "IN_PROGRESS" || sStatus === "In Progress") {
                    return "Warning";
                } else {
                    return "None";
                }
            }
        },

        onInit: function () {
            var oTable = this.byId("incidentTable");
            oTable.attachUpdateStarted(function () {
                sap.ui.core.BusyIndicator.show(0);
            });
            oTable.attachUpdateFinished(function () {
                sap.ui.core.BusyIndicator.hide();
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDashboard", {}, true);
            }
        }
    });
});
