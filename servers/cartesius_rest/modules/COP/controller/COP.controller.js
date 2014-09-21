jQuery.sap.require("sap.ui.Cartesius.modules.app.util.Controller");
jQuery.sap.includeStyleSheet('modules/COP/css/style.css');

sap.ui.Cartesius.modules.app.util.Controller.extend("sap.ui.Cartesius.modules.COP.controller.COP", {

	onInit : function() {

	},

	onNavBack : function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	}

});
