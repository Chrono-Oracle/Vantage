const { Schema, model } = require('mongoose');

const categorySchema = new Schema ({
    name: {
        type: String,
        min: 5,
        max: 50,
        trim: true,
        required: true
    },

    sport: {
        type: Schema.Types.ObjectId,
        ref: 'sports',
    }

}, { timestamps: true });

const Category = model( 'categories', categorySchema);

module.exports = Category;