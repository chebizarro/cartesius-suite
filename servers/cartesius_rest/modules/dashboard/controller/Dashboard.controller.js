jQuery.sap.require("sap.ui.Cartesius.modules.app.util.Controller");
jQuery.sap.require("sap.ui.core.IconPool");

sap.ui.Cartesius.modules.app.util.Controller.extend("sap.ui.Cartesius.modules.dashboard.controller.Dashboard", {

	onInit : function (evt) {

		// set mock model
		var sPath = jQuery.sap.getModulePath("sap.ui.Cartesius.data", "/data.json");
		var oModel = new sap.ui.model.json.JSONModel(sPath);
		this.getView().setModel(oModel);
		
		
		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

	},


	onRouteMatched : function(oEvent, data) {
		var sName = oEvent.getParameter("name");

		if (sName !== "dash") {
			return;
		}

		//Load the dash view in desktop
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.modules.dashboard.view.Dashboard",
			targetViewType : "XML"
		});
	},

	handlePress : function (evt) {
		var tile = evt.getSource().data("key");
		
		if(tile) {
			this.getRouter().navTo(tile, {
				from: "dash"
			}, true);
		}
		
	},

	handleEditPress : function (evt) {
		var oTileContainer = this.getView().byId("container");
		var newValue = ! oTileContainer.getEditable();
		oTileContainer.setEditable(newValue);
		evt.getSource().setText(newValue ? "Done" : "Edit");
	},

	handleTileDelete : function (evt) {
		var tile = evt.getParameter("tile");
		evt.getSource().removeTile(tile);
	},
	
	
	
});
