jQuery.sap.require("sap.ui.Cartesius.util.Controller");
jQuery.sap.includeStyleSheet('modules/dashboard/css/style.css');

sap.ui.Cartesius.util.Controller.extend("sap.ui.Cartesius.modules.dashboard.controller.Dashboard", {

	onInit : function (evt) {
		// set mock model
		var sPath = jQuery.sap.getModulePath("sap.ui.Cartesius.data", "/data.json");
		var oModel = new sap.ui.model.json.JSONModel(sPath);
		this.getView().setModel(oModel);
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
	}
});
