jQuery.sap.declare("sap.ui.Cartesius.modules.app.Component");
jQuery.sap.require("sap.ui.Cartesius.modules.app.Router");
jQuery.sap.includeStyleSheet('modules/app/css/style.css');

sap.ui.core.UIComponent.extend("sap.ui.Cartesius.modules.app.Component", {
	metadata : {
		name : "Cartesius",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "sap.ui.Cartesius.modules.app.view.App",

		config : {
			resourceBundle : "modules/app/i18n/messageBundle.properties",
			serviceConfig : {
				name : "Cartesius",
				serviceUrl : "http://192.168.1.69:5050"
			}
		},

		routing : {
			config : {
				routerClass : sap.ui.Cartesius.Router,
				viewType : "XML",
				viewPath : "sap.ui.Cartesius.modules",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "app.view.Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "COP",
							name : "COP",
							view : "COP.view.COP",
							subroutes : [
								{
									pattern : "sidebar",
									name : "sidebar",
									view : "COP.view.Sidebar"
								}
							]
						},
						{
							pattern : "dash",
							name : "dash",
							view : "dashboard.view.Dashboard"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "app.view.Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "app.view.NotFound",
							transition : "show"
						}
					]
				}			
			]
		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var rootPath = jQuery.sap.getModulePath("sap.ui.Cartesius");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		//var sServiceUrl = mConfig.serviceConfig.serviceUrl;

		// Create and set domain model to the component
		//var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		//this.setModel(oModel);

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");

		this.getRouter().initialize();
	},

});
