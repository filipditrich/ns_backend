const mongoose = require('mongoose');
const msgs = require('../assets/messages');

const jerseySchema = mongoose.Schema({

    // TODO: rethink this
    name: { type: String, required: msgs.JERSEY.NAME.REQUIRED, unique: msgs.JERSEY.NAME.UNIQUE },
    color: { type: String },
    thumbnail: { type: String }

});

/**
 * @description Exports Jersey Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('Jersey', jerseySchema);