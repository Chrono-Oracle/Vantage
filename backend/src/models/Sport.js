const { Schema, model } = require('mongoose');
const { minLength } = require('zod');

const sportSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 3
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    logo: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Sport = model( "Sport", sportSchema);

module.exports = Sport;