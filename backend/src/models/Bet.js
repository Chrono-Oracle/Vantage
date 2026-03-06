const { Schema, model } = require('mongoose');

const betSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    choice: {
        type: String,
        enum: ['1', 'X', '2'],
        required: true
    },
    stake: {
        type: Number,
        required: true,
        min: [1, 'Minimum bet is 1'] 
    },
    oddsAtPlacement: {
        type: Number,
        required: true
    },
    potentialPayout: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost', 'void', 'cashed_out'],
        default: 'pending'
    }
}, { timestamps: true });

const Bet = model( "Bet", betSchema);

module.exports = Bet;