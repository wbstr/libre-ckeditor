/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* exported CKBUILDER_CONFIG */

var CKBUILDER_CONFIG = {
	skin: 'moono-lisa',
	ignore: [
		'bender.js',
		'bender.ci.js',
		'.bender',
		'bender-err.log',
		'bender-out.log',
		'.travis.yml',
		'dev',
		'docs',
		'.DS_Store',
		'.editorconfig',
		'.gitignore',
		'.gitattributes',
		'gruntfile.js',
		'.idea',
		'.jscsrc',
		'.jshintignore',
		'.jshintrc',
		'less',
		'.mailmap',
		'node_modules',
		'package.json',
		'README.md',
		'tests'
	],
	plugins : {
		'wysiwygarea' : 1,
		'toolbar' : 1,
		'basicstyles' : 1,
		'font' : 1,
		'justify' : 1,
		'list' : 1,
		'table' : 1,
		'undo' : 1,
		'base64image' : 1,
		'autogrow' : 1
	},
	languages : {
		'en' : 1,
		'hu' : 1
	}
};
