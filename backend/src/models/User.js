const { Schema, model } = require('mongoose');

const userSchema = new Schema ({
    fullName: {
        type: String,
        required: true,
        min: 4,
        max: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        min: 8,
        max: 20,
        trim: true,
        unique: type,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        min: 8,
        max: 50,
        trim: true
    },
    role: {
        type: String,
        enum: [ 'admin', 'user' ],
        default: 'user',
    },
    status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'active'
    }

}, { timestamps: true });

const User = model( 'users', User);

module.exports = User;