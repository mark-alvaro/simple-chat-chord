const mongoose= require('mongoose');

const memberSchema= mongoose.Schema({
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
        required:true
    },
    user_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        defautl:{}
    }]
    
},
{ timestamps:true}
);

module.exports= new mongoose.model('Member', memberSchema)