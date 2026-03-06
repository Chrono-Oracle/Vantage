const { Schema, model } = require('mongoose');
const { lowercase, trim } = require('zod');

const categorySchema = new Schema ({
    name: {
        type: String,
        min: 5,
        max: 50,
        trim: true,
        required: true
    },

    slug: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true
    },

    sport: {
        type: Schema.Types.ObjectId,
        ref: 'Sport',
        required: true
    },

    logo: {
        type: String,
        default: ''
    },

    priority: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Category = model( "Category", categorySchema);

module.exports = Category;