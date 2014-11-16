'use strict';

var calendars = require('../controllers/calendar');

// Calendar authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.calendar.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Calendars, app, auth) {

    app.route('/calendars')
        .get(calendars.all)
        .post(auth.requiresLogin, calendars.create);
    app.route('/calendars/:calendarId')
        .get(calendars.show)
        .put(auth.requiresLogin, hasAuthorization, calendars.update)
        .delete(auth.requiresLogin, hasAuthorization, calendars.destroy);

    // Finish with setting up the calendarId param
    app.param('calendarId', calendars.calendar);
};
