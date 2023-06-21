const mongoose= require('mongoose');

const groupSchema= mongoose.Schema({
    creator_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    limit:{
        type:Number,
        required:true
    },
    members_id:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:{}
        }
    ]
    
},
{ timestamps:true}
);

module.exports= new mongoose.model('Group', groupSchema)