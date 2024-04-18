require('dotenv').config();
const mongoose = require('mongoose');

const dbUlr = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.vlmwfvo.mongodb.net/chatApp?retryWrites=true&w=majority&appName=Cluster0`

const connectDB = async (app) => {
    try {
        const connection = await mongoose.connect(dbUlr);
        console.log('Connect to MongoDB successfully');
    } catch (error) {
        console.log('Connect to MongoDB failed');
    }
};

module.exports = connectDB;