const AuthRoute = require('./auth');

module.exports = function (app) {

    // Authentication API
    app.use('/api/auth', AuthRoute(app));

    // Response Handler (Errors)
    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            response: {
                identifier: error.name || error.identifier,
                message: error.message,
                success: error.success || false,
                status: error.status || 500,
                stack: error.stack || null,
            }
        })
    });

};