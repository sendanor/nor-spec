"use strict";
var is = require('nor-is');
var debug = require('nor-debug');
var copy = require('nor-data').copy;
var ARRAY = require('nor-array');
var PATH = require('path');

/** Index for route directories */
module.exports = function(spec) {

	debug.assert(spec).is('object');
	debug.assert(spec.routes).ignore(undefined).is('object');
	debug.assert(spec.params).ignore(undefined).is('object');
	debug.assert(spec.path).ignore(undefined).is('string');

	var modules = {};

	if(spec.routes && spec.params.path) {
		ARRAY(Object.keys(spec.routes)).forEach(function(key) {
			var route = spec.routes[key];
			modules[key] = require(PATH.resolve(spec.path, route));
		});
	} else {
		debug.warn("No routes detected.");
	}

	return function(opts) {

		// Verify and initialize opts
		debug.assert(opts).ignore(undefined).is('object');
		if(!opts) {
			opts = {};
		}

		// Copy spec.params as options
		if(is.object(spec.params)) {
			ARRAY(Object.keys(spec.params)).forEach(function(key) {
				if(!opts.hasOwnProperty(key)) {
					opts[key] = copy(spec.params[key]);
				}
			});
		}

		// Build routes
		var tmp = {};
		if(spec.routes) {
			ARRAY(Object.keys(spec.routes)).forEach(function(key) {
				if(is.func(modules[key])) {
					tmp[key] = modules[key](opts);
				} else if(is.obj(modules[key])) {
					tmp[key] = modules[key];
				}
			});
		}
		return tmp;
	};

};
