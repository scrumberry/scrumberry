'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Calendar = new Module('calendar');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Calendar.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Calendar.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Calendar.menus.add({
    title: 'Calendar',
    link: 'Calendar',
    roles: ['authenticated'],
    menu: 'main'
  });

  Calendar.aggregateAsset('css', 'calendar.css');
  
  console.log('Calendar module initialized');


  return Calendar;
});
