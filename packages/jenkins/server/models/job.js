'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Job Schema
 */
var JobSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true,
        required: true        
    },
    lastFailedBuild: {
        type: String,
    	default: '',
    	trim: true    	
    }, 
    lastBuild: {
        type: String,
    	default: '',
    	trim: true    	
    }, 
    lastStatusChange: {
        type: Date,
        default: ''
    },     
    alarm: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        default: '',
        trim: true
    },    
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    apiUrl:{
        type: String,
    	default: '',
    	trim: true
    },
});

/**
 * Validations
 */
JobSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
JobSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Job', JobSchema);
