var mongoose = require('mongoose');
var config = require('config-lite');
mongoose.connect(config.mongodb);
var schedule = require('node-schedule');

