const mongoose = require('mongoose');
// const url = 'mongodb://0.0.0.0:27017/grain-markete';
const url = 'mongodb+srv://amirowaisy72:iVVKYSj5rugATyVg@cluster0.mpb1bfz.mongodb.net/grain-markete-general';
mongoose.set('strictQuery', false);

const connecToMongoose = ()=>{
    mongoose.connect(url);
    console.log("Connected to mongodb")
};

module.exports = connecToMongoose;