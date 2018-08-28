const codes = require('../assets/codes.asset');
const sysCodes = require('northernstars-shared').sysCodes;
const errorHelper = require('northernstars-shared').errorHelper;
const _ = require('lodash');
const Service = require('../models/service.schema');

exports.exportCodes = (req, res, next) => {

    // TODO: export codes from other service as well
    let output = {};
    output['operator'] = codes;
    output['shared'] = sysCodes;

    res.json({ response: sysCodes.RESOURCE.LOADED, output });

};

exports.exportRoutes = (req, res, next) => {

    // TODO: export routes from other services as well
    let output = {},
        routes = require('../routes/index.route.conf'),
        allowed = ['id', 'method', 'url', 'params', 'roles'];

    output['operator'] = _.map(routes, _.partialRight(_.pick, allowed));

    res.json({ response: sysCodes.RESOURCE.LOADED, output })

};

exports.updateServices = (req, res, next) => {

    const serviceConfig = req.body['service'];

    Service.findOne({ id: serviceConfig.id }).exec()
        .then(service => {
            return service ? service.remove() : Promise.resolve();
        })
        .then(() => {
            const svc = new Service(serviceConfig);
            svc.save().then(saved => {

                res.json({
                    response: sysCodes.REQUEST.PROCESSED,
                    output: saved
                });

            }).catch(error => {
                return next(errorHelper.prepareError(error));
            });
        })
        .catch(error => {
            return next(errorHelper.prepareError(error));
        });

};