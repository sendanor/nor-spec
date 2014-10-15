"use strict";
var debug = require('nor-debug');
var copy = require('nor-data').copy;
var ARRAY = require('nor-array');
var $Q = require('q');
var PATH = require('path');

/** Index for method based directories */
module.exports = function(spec) {

	debug.assert(spec).is('object');
	debug.assert(spec.steps).ignore(undefined).is('array');
	debug.assert(spec.params).ignore(undefined).is('object');
	debug.assert(spec.path).ignore(undefined).is('string');

	// Build `modules` object with modules from `spec.steps` mapped
	var modules = [];

	if(spec.steps && spec.path) {
		modules = ARRAY(spec.steps).map(function(file) {
			return require( PATH.resolve(spec.path, file) );
		}).valueOf();
	}

	return function(opts) {

		// Verify and initialize opts
		debug.assert(opts).ignore(undefined).is('object');
		if(!opts) {
			opts = {};
		}

		// Copy properties from `spec.params` to opts
		if(spec.params) {
			ARRAY(Object.keys(spec.params)).forEach(function(key) {
				if(!opts.hasOwnProperty(key)) {
					opts[key] = copy(spec.params[key]);
				}
			});
		}

		// Build all steps ready
		var steps = ARRAY(modules).map(function(fun) {
			debug.assert(fun).is('function');
			var f = fun(opts);
			debug.assert(f).is('function');
			return f;
		}).valueOf();

		// Returns full request handler
		return function() {
			var args = Array.prototype.slice.call(arguments);
			return ARRAY(steps).reduce(function(a, b) {
				debug.assert(b).is('function');
				return a.then( b.bind.apply(b, [undefined].concat( args ) ) );
			}, $Q());
		};
	};

};
