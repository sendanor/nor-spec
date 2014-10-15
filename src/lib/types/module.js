"use strict";
var is = require('nor-is');
var debug = require('nor-debug');
var copy = require('nor-data').copy;
var ARRAY = require('nor-array');
var PATH = require('path');

/** Index for route directories */
module.exports = function(spec) {

	debug.assert(spec).is('object');
	debug.assert(spec.exports).ignore(undefined).is('object');
	debug.assert(spec.params).ignore(undefined).is('object');
	debug.assert(spec.path).ignore(undefined).is('string');

	var modules = {};

	if(spec.exports && spec.params.path) {
		ARRAY(Object.keys(spec.exports)).forEach(function(key) {
			var route = spec.exports[key];
			modules[key] = require(PATH.resolve(spec.path, route));
		});
	} else {
		debug.warn("No exports detected.");
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

		// Build exports
		var tmp = {};
		if(spec.exports) {
			ARRAY(Object.keys(spec.exports)).forEach(function(key) {
				if(is.func(modules[key])) {
					tmp[key] = modules[key](opts);
				}
			});
		}
		return tmp;
	};

};
