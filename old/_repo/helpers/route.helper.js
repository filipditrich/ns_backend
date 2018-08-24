const _ = require('lodash');
let routes;

exports.importRoutes = (imported) => {
    routes = imported;
};

exports.genericRouteHandler = (req, res, next) => {

    const match = _.find(routes, route => {
        return (new RegExp(route.regExp)).test(req.path) && route.method.toUpperCase() === req.method;
    });

    if (match) {

        const params = (new RegExp(match.regExp)).exec(req.path);
        params.shift(); // get rid of the full match (leaves only the params)

        match.path.split("/").filter(x => x.startsWith(":")).forEach((param, i) => {
            // format the param (delete ':' selector and delete possible Regular Expression
            param = param.replace(/\((.*?)\)/, "").replace("?", "").replace(":", "");
            req.params[param] = params[i];
        });

        const pre = [];
        _.forEach(match.pre, p => pre.push(p(req, res, next)));

        Promise.all(pre).then(() => {

            try {
                match.controller(req, res, next);
            } catch (error) {
                return next(error);
            }

        }).catch(error => {
            return next(error);
        });


    } else {
        return next();
    }

};