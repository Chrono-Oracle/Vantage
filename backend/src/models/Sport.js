const { Schema, model } = require('mongoose');

const sportSchema = new Schema ({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 50,
        trim: true,
        required: true
    },

}, { timestamps: true });

const Sport = model( 'sports', sportSchema);

module.exports = Sport;