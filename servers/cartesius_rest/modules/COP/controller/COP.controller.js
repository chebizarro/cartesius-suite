jQuery.sap.require("sap.ui.Cartesius.modules.app.util.Controller");
jQuery.sap.includeStyleSheet('modules/COP/css/style.css');

sap.ui.Cartesius.modules.app.util.Controller.extend("sap.ui.Cartesius.modules.COP.controller.COP", {

	onInit : function() {
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.modules.COP.view.Sidebar",
			targetViewType : "XML",
			isMaster: true
		});

		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
	},

	onNavBack : function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},


	onRouteMatched : function(oEvent) {
		var sName = oEvent.getParameter("name");

		if (sName !== "COP") {
			return;
		}

		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.modules.COP.view.COP",
			targetViewType : "XML"
		});

		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.modules.COP.view.Sidebar",
			targetViewType : "XML",
			isMaster: true
		});
	}
});
