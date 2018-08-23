const Route = require('northernstars-shared').routeInterface;

module.exports = [

    new Route('LOGIN', 'POST', '/auth/login', { roles: false, secret: false }, (req, res) => { res.send("DOPE"); })

];