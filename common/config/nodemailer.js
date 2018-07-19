const nodemailer = require('nodemailer');
const config = require('./common');
const env = require('express')().get('env');

exports.transporter = nodemailer.createTransport( config[env].email.transporter );

exports.sender = config[env].email.sender;