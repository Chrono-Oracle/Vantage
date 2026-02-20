const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL


const connect = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        return true;
    } catch (error) {
        console.error("Database connection error: ", error);
        return false;
    }
}

module.exports = { connect }