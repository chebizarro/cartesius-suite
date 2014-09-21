jQuery.sap.require("sap.ui.Cartesius.modules.app.util.Controller");
jQuery.sap.includeStyleSheet('modules/app/css/style.css');

sap.ui.Cartesius.modules.app.util.Controller.extend("sap.ui.Cartesius.modules.app.controller.Master", {

	onInit : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();
		
		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent, data) {
		var sName = oEvent.getParameter("name");

		if (sName !== "main") {
			return;
		}

		this.getRouter().navTo("dash", {"from": "main"}, true);

/*
		//Load the Dashboard view
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.modules.dashboard.view.Dashboard",
			targetViewType : "XML"
		});
*/
	},


});
