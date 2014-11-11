'use strict';

// Jenkins params routes use params controller
var paramsCtrl = require('../controllers/params');

// Param authorization helpers
var hasAuthorization = function(req, res, next) {
	//if (req.param.user.id !== req.user.id) {
     //return res.send(401, 'User is not authorized');
 	//}
 next();
};

module.exports = function(Jenkins, app, auth) {
    app.get('/jenkinsParams', paramsCtrl.all);
    app.post('/jenkinsParams', auth.requiresLogin, paramsCtrl.create);
    app.get('/jenkinsParams/:paramId', paramsCtrl.show);
    app.put('/jenkinsParams/:paramId', auth.requiresLogin, hasAuthorization, paramsCtrl.update);
    app.delete('/jenkinsParams/:paramId', auth.requiresLogin, hasAuthorization, paramsCtrl.destroy);
    
    // Finish with setting up the paramId param
    app.param('paramId', paramsCtrl.param);
};