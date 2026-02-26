const { Schema, model } = require('mongoose');

const matchSchema = new Schema ({

    time: {
        type: String,
        required: true,
        min: 4,
        max: 50,
        trim: true,
        required: true
    },
    teamA: {
        type: String,
        required: true,
        min: 4,
        max: 50,
        trim: true,
        required: true
    },
    teamB: {
        type: String,
        required: true,
        min: 4,
        max: 50,
        trim: true,
        required: true
    },
    oddA: {
        type: Number,
        required: true,
        default: 1
    },
    oddB: {
        type: Number,
        required: true,
        default: 1
    },
    status: {
        type: String,
        required: true,
        enum: ['upcoming', 'ongoing', 'finished'],
        default: 'upcoming'
    },

}, { timestamps: true });

const Match = model( 'matches', matchSchema);

module.exports = Match;