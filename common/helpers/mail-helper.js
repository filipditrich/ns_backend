const mailing = require('../config/nodemailer');
// const EmailTemplate = require('emails-templates').EmailTemplate;
const EmailTemplate = require('email-templates');
const path = require('path');


module.exports.mail = (template, contexts) => {

    // Contexts need to be typeof Array
    if (!Array.isArray(contexts)) {
        let temp = contexts;
        contexts = [];
        contexts.push(temp);
    }

    return new Promise((resolve, reject) => {
        loadTemplate(template, contexts).then(results => {
            Promise.all(results.map(result => {
                mailing.transporter.sendMail({
                    to: result.context.email,
                    from: mailing.sender,
                    subject: result.context.subject,
                    html: result.email,
                });
            })).then(() => resolve()).catch(e => reject(e));
        });
    });

};

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
            Template.render(path.join('../templates/emails', template, 'index'), context)
                .then(result => {
                    return resolve({ email: result, context });
                })
                .catch(error => { return reject(error) });
        });
    }));


}