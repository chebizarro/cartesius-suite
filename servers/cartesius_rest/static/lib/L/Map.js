jQuery.sap.registerModulePath('Map', '/lib/L/');
jQuery.sap.includeStyleSheet('//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css');

//jQuery.sap.registerModulePath('leaflet', 'http://cdn.leafletjs.com/leaflet-0.7.3/'); //not working

jQuery.sap.require("Map.thirdparty.leaflet.leaflet");
//jQuery.sap.require("leaflet.leaflet");


var leaflet_ns = 'sap.ui.Cartesius.lib.L.Map';
jQuery.sap.declare(leaflet_ns);

sap.ui.core.Control.extend(leaflet_ns, {
    metadata : {
        properties : {
			// Base Map
			baseMapUrl: {type : "string", defaultValue: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"},
			attribution: {type : "string", defaultValue: "Map data © <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors"},
			minZoom: {type : "int", defaultValue: 2},
			maxZoom: {type : "int", defaultValue: 12},

			// View options
            latitude: {type : "float", defaultValue: 51.3},
            longitude: {type : "float", defaultValue: 0.7},
            zoomLevel: {type : "int", defaultValue: 8},
            userLocation: {type: "boolean", defaultValue: false },

			// Map control display
            displayZoom: {type: "boolean", defaultValue: true },
            displayAttribution: {type: "boolean", defaultValue: true },
 
			// Control display
            height: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},
            width: {type: "sap.ui.core.CSSSize", defaultValue: "100%"}

		},
		
		events : {
		}
    },
        
    init: function(){
        
    },
    
    renderer : function(oRm, oControl) {
		console.log(leaflet_ns+".Map.onAfterRendering()");
        
		oRm.write("<div id='canvas_holder'>");
        oRm.write("<div ");
        oRm.writeControlData(oControl);       
		oRm.addStyle("position", "absolute");
        oRm.addStyle("width", oControl.getWidth());
        oRm.addStyle("height", oControl.getHeight());
        oRm.writeStyles();
		oRm.write(">");
        oRm.write("</div>");
        oRm.write("</div>");
        
    },
    
    onAfterRendering : function() {
		console.log(leaflet_ns+".Map.onAfterRendering()");
		
		// start the map
		this.map = new L.Map(this.sId,
									{
										zoomControl: this.getDisplayZoom(),
										attributionControl: this.getDisplayAttribution() 
									});

		this.map.zoomControl.setPosition("bottomright");
		
		this.map.setView(new L.LatLng(this.getLatitude(), this.getLongitude()),this.getZoomLevel());

		if(this.getUserLocation) {
			this.map.locate({"setView": true});
		}

		// create the tile layer with correct attribution		
		var layer = new L.TileLayer(this.getBaseMapUrl(),
									{	
										minZoom: this.getMinZoom(),
										maxZoom: this.getMaxZoom(),
										attribution: this.getAttribution()
									});	
 		
		this.map.addLayer(layer);
		
		
		// Feels kind of hacky
		var that = this;
		jQuery(document).ready(function(){
			//setTimeout(that.map.invalidateSize.bind(that.map),500);
			that.map.invalidateSize();
		});

    }
    
});

