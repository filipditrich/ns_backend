const SMTPConnectionAsPromised = require('smtp-connection-as-promised');
const nodemailer = require('nodemailer');
const config = require('../config/server.config');
const env = require('express')().get('env');

/**
 * @description Creates NodeMailer Transport
 */
exports.transporter = nodemailer.createTransport( config[env].email.transporter );

/**
 * @description Exports Sender Config
 * @type {*|string|RTCRtpSender}
 */
exports.sender = config[env].email.sender;

/**
 * @description Checks the connection to SMTP
 * @author filipditrich
 * @returns {Promise<any>}
 */
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