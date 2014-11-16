'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Calendar = mongoose.model('Calendar'),
  _ = require('lodash');


/**
 * Find calendar by id
 */
exports.calendar = function(req, res, next, id) {
	Calendar.load(id, function(err, calendar) {
    if (err) return next(err);
    if (!calendar) return next(new Error('Failed to load calendar ' + id));
    req.calendar = calendar;
    next();
  });
};

/**
 * Create a calendar
 */
exports.create = function(req, res) {
  var calendar = new Calendar(req.body);
  calendar.user = req.user;

  calendar.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the calendar'
      });
    }
    res.json(calendar);

  });
};

/**
 * Update a calendar
 */
exports.update = function(req, res) {
  var calendar = req.calendar;

  calendar = _.extend(calendar, req.body);

  calendar.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the calendar'
      });
    }
    res.json(calendar);

  });
};

/**
 * Delete an calendar
 */
exports.destroy = function(req, res) {
  var calendar = req.calendar;

  calendar.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the calendar'
      });
    }
    res.json(calendar);

  });
};

/**
 * Show a calendar
 */
exports.show = function(req, res) {
  res.json(req.calendar);
};

/**
 * List of Calendars
 */
exports.all = function(req, res) {
	Calendar.find().sort('-created').populate('user', 'name username').exec(function(err, calendars) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the calendars'
      });
    }
    res.json(calendars);

  });
};
