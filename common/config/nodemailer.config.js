const nodemailer = require('nodemailer');
const config = require('./common.config');
const env = require('express')().get('env');
const SMTPConnectionAsPromised = require('smtp-connection-as-promised');

exports.transporter = nodemailer.createTransport( config[env].email.transporter );

exports.sender = config[env].email.sender;

exports.checkAuth = () => {
    return new Promise((resolve, reject) => {

        const options = config[env].email.transporter;
        const connection = new SMTPConnectionAsPromised(options);

        connection.connect().then(() => {
            connection.login(options.auth).then(() => {
                connection.quit().then((status) => {
                    if (status) { reject('dunno') }
                    else { resolve(); }
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        }).catch(error => reject(error));

    });
};