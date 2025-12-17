sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("ehsm.controller.IncidentManagement", {
        formatter: {
            statusState: function (sStatus) {
                if (sStatus === "Closed" || sStatus === "Resolved") {
                    return "Success";
                } else if (sStatus === "Open" || sStatus === "New") {
                    return "Error";
                } else if (sStatus === "In Progress") {
                    return "Warning";
                } else {
                    return "None";
                }
            },
            priorityState: function (sPriority) {
                if (sPriority === "High" || sPriority === "Critical") {
                    return "Error";
                } else if (sPriority === "Medium") {
                    return "Warning";
                } else {
                    return "Success";
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
