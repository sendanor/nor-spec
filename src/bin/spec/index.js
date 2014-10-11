/*
 * Sendanor JavaScript Framework
 * Copyright 2014 Sendanor <info@sendanor.com>
 * Copyright 2014 Jaakko-Heikki Heusala <jheusala@iki.fi>
 */

"use strict";

var debug = require('nor-debug');
var _Q = require('q');
var fs = require('nor-fs');
var ARRAY = require('nor-array');
var PATH = require('path');
var argv = require('minimist')(process.argv.slice(2));

var context = {};
context.path = process.cwd();
context.spec_path = PATH.resolve(context.path, 'spec.json');
context.argv = argv;

var commands = require('./commands');

_Q.fcall(function() {

	context.spec = {};

	if(!context.spec_path) {
		return;
	}

	return fs.exists(context.spec_path).then(function(exists) {
		if(!exists) {
			return;
		}
		return fs.readFile(context.spec_path, {"encoding": "utf-8"}).then(function(json) {
			context.spec = JSON.parse(json);
		});
	});

}).then(function() {

	return ARRAY(argv._).map(function(command) {
		var fun = commands[command];
		if(!fun) {
			throw new TypeError("unknown command: " + command);
		}
		return fun;
	}).reduce(function(a, b) {
		return a.then( b.bind(undefined, context) );
	}, _Q());

}).fail(function(err) {
	debug.error(err);
}).done();


/* EOF */
