const mongoose= require('mongoose');

const groupchatSchema= mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
        required:true
    },
    message:{
        type:String,
        required:true
    }
    
},
{ timestamps:true}
);

module.exports= new mongoose.model('GroupChat', groupchatSchema)