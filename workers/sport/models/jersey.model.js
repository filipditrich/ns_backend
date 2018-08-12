const mongoose = require('mongoose');
const validators = require('../../../common/helpers/validator.helper');
const codes = require('../../../common/assets/codes');
const msgs = require('../assets/messages');

const jerseySchema = mongoose.Schema({

    // TODO: rethink this
    name: { type: String, required: true, unique: true },
    color: { type: String },
    thumbnail: { type: String }

});

/**
 * @description Exports Jersey Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Jersey', jerseySchema);