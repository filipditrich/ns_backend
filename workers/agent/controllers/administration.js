const RegistrationRequest = require('../models/registration-request');
const codes = require('../../../common/assets/codes');


exports.approveRegistration = (req, res, next) => {

    let hash = req.params['registrationHash'];

    RegistrationRequest.findOne({ 'registration.registrationHash': hash }).exec()
        .then(request => {

            if (!request) return next(codes.AUTH.REGISTRATION.REQUEST.NON_EXISTENCE);
            if (request.registration.userRegistered) return next(codes.AUTH.REGISTRATION.REQUEST.USER_REGISTERED);
            if (request.approval.approved) return next(codes.AUTH.REGISTRATION.REQUEST.ALREADY_APPROVED);

            request.approval.approved = true;
            request.approval.approvedOn = new Date();
            request.approval.approvedBy = req.user._id;

            request.save(error => {
               if (error) return next(error);
               res.json({ response: codes.AUTH.REGISTRATION.REQUEST.APPROVE_SUCCESS });
               // TODO - send email to email associated with approved user
            });

        })
        .catch(error => {
            return next(error);
        });

};