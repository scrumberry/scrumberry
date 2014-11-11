'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * JenkinsParam Schema
 */
var JenkinsParamSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    code: {
        type: String,
        default: '',
        trim: true,
        required: true        
    },
    name: {
        type: String,
        default: '',
        trim: true,
        required: true        
    },    
    value:{
        type: String,
    	default: '',
    	trim: true
    }
});

/**
 * Validations
 */
JenkinsParamSchema.path('code').validate(function(code) {
    return code.length;
}, 'Code cannot be blank');

/**
 * Statics
 */
JenkinsParamSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

JenkinsParamSchema.statics.findByCode = function(criteria, cb) {
    this.findOne(
        criteria
    ).populate('user', 'name username').exec(cb);
};

mongoose.model('JenkinsParam', JenkinsParamSchema);