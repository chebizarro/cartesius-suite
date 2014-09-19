jQuery.sap.declare("sap.ui.Cartesius.util.Formatter");

sap.ui.Cartesius.util.Formatter = {

	uppercaseFirstChar : function(sStr) {
		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
	},

	discontinuedStatusState : function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue : function(sDate) {
		return sDate ? "Discontinued" : "";
	},

	currencyValue : function (value) {
		return parseFloat(value).toFixed(2);
	},
	
	shortDate: function (value) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyy KK:mm:ss" }); 
		var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
		var dateStr = dateFormat.format(new Date(value));
		return dateStr;
	}

};
