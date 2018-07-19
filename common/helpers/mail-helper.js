const mailing = require('../config/nodemailer');
// const EmailTemplate = require('email-templates').EmailTemplate;
const EmailTemplate = require('email-templates');
const path = require('path');

module.exports.send = (template, contexts) => {

    loadTemplate(template, contexts).then(results => {
        return Promise.all(results.map((result) => {
            sendIt({
                to: result.context.email,
                from: mailing.sender,
                subject: result.context.subject,
                html: result.email.html,
                text: result.email.text
            });
        }));
    });

};

function sendIt (payload) {
    return new Promise((resolve, reject) => {
        mailing.transporter.sendMail(payload)
            .then(() => resolve())
            .catch(e => reject(e));
    });
}

function loadTemplate (template, contexts) {

    let Template = new EmailTemplate({
        views: {
            options: {
                extension: 'ejs'
            },
            root: path.resolve(__dirname)
        }
    });

    return Promise.all(contexts.map(context => {
        return new Promise((resolve, reject) => {
            Template.render((path.join('../templates/email', template, 'index')), context, (error, result) => {
                if (error) reject(error);
                resolve({
                    email: result,
                    context: context
                });
            });
        });
    }));

}