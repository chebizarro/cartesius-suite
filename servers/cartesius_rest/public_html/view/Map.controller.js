
sap.ui.Cartesius.util.Controller.extend("sap.ui.Cartesius.view.Map", {

	onInit : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if(sap.ui.Device.system.phone) {
			//don't wait for the master on a phone
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(false);
			this.getEventBus().subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);

	},

	onMasterLoaded :  function (sChannel, sEvent, oData) {
		this.bindView(oData.oListItem.getBindingContext().getPath());
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
	},

	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function () {
			var oView = this.getView();

			// when detail navigation occurs, update the binding context
			if (oParameters.name !== "layer") { 
				return;
			}

			var sLayerPath = "/" + oParameters.arguments.layer;
			this.bindView(sLayer);
			
			var map = oView.byId("main_map");
			
			
		}, this));

	},

	bindView : function (sProductPath) {
		var oView = this.getView();
		oView.bindElement(sProductPath);

		//Check if the data is already on the client
		if(!oView.getModel().getData(sProductPath)) {

			// Check that the product specified actually was found.
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sProductPath);
				if (!oData) {
					this.showEmptyView();
					this.fireMapNotFound();
				} else {
					this.fireMapChanged(sProductPath);
				}
			}, this));

		} else {
			this.fireMapChanged(sProductPath);
		}

	},

	showEmptyView : function () {
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.ui.Cartesius.view.NotFound",
			targetViewType : "XML"
		});
	},

	fireMapChanged : function (sProductPath) {
		this.getEventBus().publish("Map", "Changed", { sProductPath : sProductPath });
	},

	fireMapNotFound : function () {
		this.getEventBus().publish("Map", "NotFound");
	},

	onNavBack : function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onDetailSelect : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("layer",{
			layer : oEvent.getSource().getBindingContext().getPath().slice(1)
		}, true);
	}

});
