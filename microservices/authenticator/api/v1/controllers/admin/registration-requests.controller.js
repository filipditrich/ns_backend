const RegistrationRequest = require('../../models/registration-request.schema');
const errorHelper = require('../../../../../../_repo/helpers/error.helper');
const mailHelper = require('../../../../../../_repo/helpers/mail.helper');
const codes = require('../../assets/codes.asset');

exports.approveRegistrationRequest = (req, res, next) => {

    const hash = req.params['hash'];

    RegistrationRequest.findOne({ 'registration.registrationHash': hash }).exec()
        .then(request => {

            if (!request) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.NON_EXISTENCE));
            if (request.registration.userRegistered) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.USER_REGISTERED));
            if (request.approval.approved) return next(errorHelper.prepareError(codes.REGISTRATION.REQUEST.ALREADY_APPROVED));

            request.approval.approved = true;
            request.approval.approvedOn = new Date();
            request.approval.approvedBy = req.user._id;
            request.approval.approvedByUser = req.user.name;

            request.save().then(() => {

                mailHelper.mail('registration-approved', {
                    email: request.email,
                    name: request.name,
                    hash: request.registration.registrationHash,
                    subject: 'Registration Approved!'
                }).then(() => {
                    res.json({ response: codes.REGISTRATION.REQUEST.APPROVE_SUCCESS });
                }).catch(error => {
                    return next(errorHelper.prepareError(error));
                });

            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });

        }).catch(error => {
            return next(errorHelper.prepareError(error));
    });

};