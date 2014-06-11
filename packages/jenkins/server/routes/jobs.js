'use strict';

// Jenkins jobs routes use jobs controller
var jobsCtrl = require('../controllers/jobs');

//Job authorization helpers
var hasAuthorization = function(req, res, next) {
	//if (req.job.user.id !== req.user.id) {
     //return res.send(401, 'User is not authorized');
 	//}
 next();
};

module.exports = function(Jenkins, app, auth) {
    app.get('/jobs', jobsCtrl.all);
    app.post('/jobs', auth.requiresLogin, jobsCtrl.create);
    app.get('/jobs/:jobId', jobsCtrl.show);
    app.put('/jobs/:jobId', auth.requiresLogin, hasAuthorization, jobsCtrl.update);
    app.delete('/jobs/:jobId', auth.requiresLogin, hasAuthorization, jobsCtrl.destroy);
    
    app.get('/remoteJobs', jobsCtrl.getRemoteList);

    // Finish with setting up the jobId param
    app.param('jobId', jobsCtrl.job);
};