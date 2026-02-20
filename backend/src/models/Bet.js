const { Schema, model } = require('mongoose');

const betSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref
    },
    match: {
        type: Schema.Types.ObjectId,
        ref: 'matches',
        required: true
    },
    scoreA: {
        type: String,
        required: true,
        default: 0
    },
    scoreB: {
        type: String,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost'],
        required: true,
        default: 'pending'
    }

}, { timestamps: true });

const Bet = model( 'bets', betSchema);

module.exports = Bet;