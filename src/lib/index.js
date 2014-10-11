/** Sendanor Spec Framework */
"use strict";

var ARRAY = require('nor-array');
var debug = require('nor-debug');

function index_builder(spec, opts) {
	debug.assert(spec).is('object');
	debug.assert(spec.type).ignore(undefined).is('string');

	debug.assert(opts).ignore(undefined).is('object');

	opts = opts || {};

	spec.type = spec.type || 'route';

	spec.path = opts.path;

	if(opts) {
		if(!spec.params) {
			spec.params = {};
		}
		ARRAY(Object.keys(opts)).forEach(function(key) {
			if(!spec.params.hasOwnProperty(key)) {
				spec.params[key] = opts[key];
			}
		});
	}

	//debug.log('spec = ', JSON.stringify(spec, null, 2));

	return require('./types/' + spec.type + '.js')(spec);
}

module.exports = {
	'index': index_builder
};

/** EOF */
