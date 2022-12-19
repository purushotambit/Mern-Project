const mongoose=require('mongoose');
const URL="mongodb+srv://purushotam1221:purushotam@cluster0.ravbqu4.mongodb.net/authenticaion"
mongoose.set('strictQuery', true);
const connectToMongo = ()=>{
    mongoose.connect(URL, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;