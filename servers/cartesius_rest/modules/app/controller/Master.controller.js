jQuery.sap.require("sap.ui.Cartesius.modules.app.util.Formatter");
jQuery.sap.require("sap.ui.Cartesius.modules.app.util.Controller");
jQuery.sap.includeStyleSheet('modules/app/css/style.css');

sap.ui.Cartesius.util.Controller.extend("sap.ui.Cartesius.modules.app.controller.Master", {

	onInit : function() {
		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		//Load the Map view in desktop
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.modules.dashboard.view.Dashboard",
			targetViewType : "XML"
		});
	},


});
