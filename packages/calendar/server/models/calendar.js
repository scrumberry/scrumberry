'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Calendar Schema
 */
var CalendarSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    externalId: {
        type: String,
    	default: '',
    	trim: true    	
    },
    externalAccount: {
        type: String,
		default: '',
		trim: true      	
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    description : {
    	type: String,
    	default: '',
    	trim: true
    },
    location: {
        type: String,
    	default: '',
    	trim: true   	
    },
    timezone: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
CalendarSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
CalendarSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Calendar', CalendarSchema);
