const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema ({
    fullName: {
        type: String,
        required: true,
        
    }
})