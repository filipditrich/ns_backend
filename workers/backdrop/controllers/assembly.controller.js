const enums = require('../../../common/assets/enums');
const path = require('path');
const BaseCtrl = require('../../../common/controllers/base');
const codes = require('../../../common/assets/codes');

exports.exportRoutes = (req, res, next) => {

    let type = req.params['worker'];
    let endpoints;

    switch (type) {
        case enums.WORKERS.agent.value: {
            endpoints = require(path.join(__dirname, '../../agent/config/endpoints.config')); break;
        }
        case enums.WORKERS.backdrop.value: {
            endpoints = require(path.join(__dirname, '../config/endpoints.config')); break;
        }
        default: { endpoints = false; break; }
    }

    if (!endpoints) BaseCtrl.invalidEndpoint(req, res, next);

    res.json({
        response: codes.RESOURCE.LOADED,
        endpoints: endpoints
    });

};
