const mongoose= require('mongoose');

const chatSchema= mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reciver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    }
    
},
{ timestamps:true}
);

module.exports= new mongoose.model('Chat', chatSchema)