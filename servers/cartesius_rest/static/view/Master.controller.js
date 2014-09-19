jQuery.sap.require("sap.ui.Cartesius.util.Formatter");
jQuery.sap.require("sap.ui.Cartesius.util.Controller");

sap.ui.Cartesius.util.Controller.extend("sap.ui.Cartesius.view.Master", {

	onInit : function() {
		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		//Load the Map view in desktop
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.view.Map",
			targetViewType : "XML"
		});
	},


});
