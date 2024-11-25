/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comguzcapsuperheroes/ui5-superheroe/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
