sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Sorter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/m/MessageToast",
	    "sap/m/MessageBox",
    ], function(Controller, JSONModel, Sorter, Filter, FilterOperator, FilterType, MessageToast, MessageBox){
        "use strict";

        var ListController =  Controller.extend("techcool.notifiacationm.controller.main", {
            
            onInit : function (evt){
                /*var oJSONData = {
					busy : false,
                    order : 0
				},
                oModel = new JSONModel(oJSONData);
			    this.getView().setModel(oModel, "appView");*/
                var oModel = this.getView().getModel("employees");
                this.getView().setModel(oModel, "appView");
            },

            onRefresh : function () {
                var oBinding = this.byId("notificationList").getBinding("items");
    
                oBinding.refresh();
                MessageToast.show(this._getText("refreshSuccessMessage"));
            },

            onSearch : function () {
                const oModel = [
                    'ID',
                    'FirstName',
                    'LastName',
                    'Address',
                    'HomePhone'
                ];
                var oView = this.getView(),
                    sValue = oView.byId("searchField").getValue(),
                    oFilter = new Filter("Title", FilterOperator.Contains, sValue);
    
                oView.byId("notificationList").getBinding("items").filter(oFilter, FilterType.Application);
            },
    
            onSort : function () {
                var oView = this.getView(),
                    aStates = [undefined, "asc", "desc"],
                    aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
                    sMessage,
                    iOrder = oView.getModel("appView").getProperty("/order");
    
                iOrder = (iOrder + 1) % aStates.length;
                var sOrder = aStates[iOrder];
    
                oView.getModel("appView").setProperty("/order", iOrder);
                oView.byId("notificationList").getBinding("items").sort(sOrder && new Sorter("Title", sOrder === "desc"));
    
                sMessage = this._getText("sortMessage", [this._getText(aStateTextIds[iOrder])]);
                MessageToast.show(sMessage);
            },

            onDelete : function () {
                var oContext,
                    oSelected = this.byId("NotificationListGroup").getProperty(),
                    sUserName;
                console.log("TMEA byId: " + this.byId("NotificationList"));
                console.log("TMEA oSelected: " + oSelected);
                try {
                    oContext = oSelected.getBindingContext();
                    console.log("TMEA oContext: " + oContext);
                    sUserName = oContext.getProperty("LastName");
                    oContext.delete().then(function () {
                        MessageToast.show(this._getText("deletionSuccessMessage", sUserName));
                    }.bind(this), function (oError) {
                        this._setUIChanges();
                        if (oError.canceled) {
                            MessageToast.show(this._getText("deletionRestoredMessage", sUserName));
                            return;
                        }
                        MessageBox.error(oError.message + ": " + sUserName);
                    }.bind(this));
                    this._setUIChanges(true);
                } catch (err) {
                    console.error(err.message);
                } 
            },

            onItemClose: function (oEvent) {
                var oItem = oEvent.getSource(),
                    oList = oItem.getParent();
    
                oList.removeItem(oItem);
                MessageToast.show("Item Closed: " + this._getText("deletionSuccessMessage", Title));
            },

            _getText : function (sTextId, aArgs) {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
    
            }

        });
    });
    