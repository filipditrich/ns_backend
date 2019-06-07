const mongoose = require('mongoose');
const msgs = require('../assets/messages.asset');
const Schema = mongoose.Schema;

/**
 * Standing Poll User Vote Schema
 */
const goldenStickUserVoteSchema = new Schema({
    voted: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    place: {
        type: Number,
        required: true,
    },
});

/**
 * Standing Poll Vote Schema
 */
const goldenStickVoteSchema = new Schema({
    voter: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    votedOn: {
        type: Date,
        default: Date.now(),
    },
    vote: {
        type: [ goldenStickUserVoteSchema ],
    },
});

/**
 * Standing Poll Schema
 */
const goldenStickSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    opens: {
        type: Date,
        default: Date.now(),
    },
    closes: {
        type: Date,
        default: new Date('January 19, 2038').getTime(),
    },
    voters: {
        type: [ mongoose.Schema.ObjectId ],
        required: true,
    },
    voted: {
        type: [ mongoose.Schema.ObjectId ],
        required: true,
    },
    votes: {
        type: [ goldenStickVoteSchema ],
    },
});

/**
 * @description Exports Golden Stick Model
 * @author filipditrich
 * @type {Model}
 */
module.exports = mongoose.model('GoldenStick', goldenStickSchema);
