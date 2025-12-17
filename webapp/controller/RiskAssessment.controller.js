sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("ehsm.controller.RiskAssessment", {
        formatter: {
            severityState: function (sSeverity) {
                if (sSeverity === "High" || sSeverity === "Critical") {
                    return "Error";
                } else if (sSeverity === "Medium") {
                    return "Warning";
                } else {
                    return "Success";
                }
            }
        },

        onInit: function () {
            // Busy indicator handling can be done via attaching requestSent/Completed events to model 
            // or simply using the table's busy state if needed.
            var oTable = this.byId("riskTable");
            // Simple busy handling for binding
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
