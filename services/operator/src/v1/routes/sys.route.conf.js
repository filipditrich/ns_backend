const Route = require('northernstars-shared').routeInterface;

module.exports = [

    new Route('SYS', 'GET', '/sys', { roles: false, secret: false }, (req, res) => { res.send("SYS"); })

];