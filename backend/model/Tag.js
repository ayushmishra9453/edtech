const mongoose=require("mongoose")

const tagSchema=new mongoose.Schema({
name:{
    type:String,
    trim:true
},
description:{
    type:String
},
course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"course"
}

})
module.exports=mongoose.model("Tag",tagSchema);