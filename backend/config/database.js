const mongoose=require('mongoose');
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Db connected successfully");
    })
    .catch((error)=>{
        console.log("Db Connection Failed");
        console.log(error);
        process.exit(1);
    })
}