require('dotenv').config()
const mongoose = require('mongoose');
const DB = process.env.MONGODB_URI
mongoose.connect(DB)
.then(() => {
    console.log('connection to database established successfully')
})
.catch((error) => {
    console.log('Error connecting to database: ' + error.message);
    
})