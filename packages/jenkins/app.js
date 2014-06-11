'use strict';

/*
 * Defining the Jenkins plugin package
 */
var Module = require('meanio').Module;

var Jenkins = new Module('Jenkins');

Jenkins.register(function(app, auth, database) {
    // We enable routing. By default the Package Object is passed to the routes
	Jenkins.routes(app, auth, database);
    // We are adding a link to the main menu for all authenticated users
	Jenkins.menus.add({
        'roles': ['authenticated'],
        'title': 'Jenkins',
        'link': 'all jobs'
    });
	Jenkins.aggregateAsset('css', 'jenkins.css');
    return Jenkins;
});
