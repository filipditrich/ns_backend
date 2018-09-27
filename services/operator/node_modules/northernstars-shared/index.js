/**
 * Helpers
 */
exports.validatorHelper = require('./src/helpers/validator.helper');
exports.userHelper = require('./src/helpers/user.helper');
exports.routeHelper = require('./src/helpers/route.helper');
exports.passportHelper = require('./src/helpers/passport.helper');
exports.nodemailerHelper = require('./src/helpers/nodemailer.helper');
exports.mongooseHelper = require('./src/helpers/mongoose.helper');
exports.mailHelper = require('./src/helpers/mail.helper');
exports.genericHelper = require('./src/helpers/generic.helper');
exports.errorHelper = require('./src/helpers/error.helper');
exports.enumHelper = require('./src/helpers/enum.helper');
exports.codeHelper = require('./src/helpers/code.helper');

/**
 * Generators
 */
exports.baseGenerator = require('./src/helpers/generators/base.generator');
exports.baseCodeGenerator = require('./src/helpers/generators/generic-code.generator');
exports.baseMessageGenerator = require('./src/helpers/generators/generic-message.generator');

/**
 * Interfaces
 */
exports.routeInterface = require('./src/interfaces/route.interface');

/**
 * Controllers
 */
exports.strategiesCtrl = require('./src/controllers/strategies.controller');

/**
 * Configurations
 */
exports.serverConfig = require('./src/config/server.config');
exports.servicesConfig = require('./src/config/services.config');

/**
 * Assets
 */
exports.schemaFields = require('./src/assets/schema-fields.asset');
exports.sysCodes = require('./src/assets/system-codes.asset');
exports.sysEnums = require('./src/assets/system-enums.asset');

/**
 * Email Templates
 */
// exports.emailTemplates = require('./src/templates/emails/index');
