const mongoose= require('mongoose');

const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_online:{
        type:String,
        default:'0'
    },
},
{ timestamps:true}
);

module.exports= new mongoose.model('User', userSchema)