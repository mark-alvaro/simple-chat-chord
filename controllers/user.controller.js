const User= require('../models/user.model')
const Chat= require('../models/chat.model')
const Group= require('../models/group.model')
const Member= require('../models/member.model')
const GroupChat= require('../models/groupChat.model');
const mongoose=require('mongoose')
const bcrypt= require('bcrypt')


const getDash= async (req,res)=>{
    let user=req.session.user;
    res.render('index');
}
const register= async (req,res)=>{
   res.render('register')
}

const createAccount= async (req,res)=>{
    const {name, email, password1, password2}= req.body;
    const image= req.file;
    if(!(name, email, password1, password2)){
       return res.redirect('/register')
    }
    if(password1!= password2){
       return res.redirect('/register')
    }
const hashedPassword= await bcrypt.hash(password1,12);

        const newUser= new User({
            name:name,
            email:email,
            password:hashedPassword,
            image:image.filename
        });

await newUser.save();
    

    res.redirect('/');
}

const login= async (req,res)=>{
    res.render('login')
}

const getDashboard= async (req,res)=>{
    const users= await User.find({_id: {$nin:[req.session.user._id]}});
  
    const user= req.session.user;
    res.render('dashboard',{user:req.session.user, users:users})
}

const signIn= async (req,res)=>{
    const {email, password1}= req.body;
    if(!email || !password1){
      return  res.redirect('/login')
    }
    const userdata= await User.findOne({email:email});
    if(!userdata){
        return res.redirect('/login');
    }

    else{
        const rightUser=  bcrypt.compare(password1, userdata.password)
        .then((user)=>{
            if(!user){
                new Error('Email Address does not exist')
               return res.redirect('/login');
            }
            req.session.user= userdata;
            res.cookie(`user`,JSON.stringify(userdata));
            res.redirect('/dashboard')
        })
        .catch(err=>{
            res.redirect('/login')
        })
    }
}

const Logout= async (req,res)=>{
    res.clearCookie('user')
    req.session.destroy();
    res.redirect('/login')
}



// for saving chatting message
const saveChat= async (req,res)=>{
    const {sender_id, reciver_id, message}= req.body;
    const user= await User.findById({_id:sender_id});
    const chatMessage= new Chat({
        sender_id:sender_id,
        reciver_id:reciver_id,
        message:message
    });
   const newChat= await chatMessage.save();
    res.send({success:true,data:newChat,user:user});
    
}

// for deleting Chattion Message
const deleteChat= async (req,res)=>{
    await Chat.deleteOne({_id:req.body.id})
    res.send({success:true});
}

// update Chat
const updateChat= async (req,res)=>{
    await Chat.findByIdAndUpdate({_id:req.body.id},{
        $set:{
            message:req.body.message
        }
    });
    res.send({success:true});
}

/**
 * For goruping Routes 
 */
const loadGroup= async (req,res)=>{
        try{
            const user= await req.session.user;
            const users= await User.find({_id:{$nin:[req.session.user._id]}});
            const groups= await Group.find({$or:[{creator_id:user._id}, {members_id:user._id}]});
            res.render('group',{
                message:'',
                user:user,
                groups:groups,
                users:users})
        }
        catch(err){
            res.send(err.message)
        }
}
// creating new chat
const createNewChat= async (req,res)=>{
    try{
        
        const groups= await Group.find({creator_id:req.session.user._id});
        const {name, limit,members}= req.body;
        const memberArray= await members.map((member)=>{
            return member
        })
    const group=   new Group({
        creator_id:req.session.user._id,
        name:req.body.name,
        limit:req.body.limit,
        members_id:memberArray
       });

      await group.save()
      res.redirect('/groups');
        
    }
    catch (err){
        res.send(err.message)
    }
}

// getting Members to add
const getMembers= async (req,res)=>{
    try{
        const groupId= req.body.group_id;
        const oldMembers= await Group.findById({_id:groupId}).populate('members_id');
        let member=  oldMembers.members_id.map(membersId => {
            return membersId
         });
        let users= await User.find({_id: {$nin:[req.session.user._id]}});
     
       
        res.send({success:true, data:users, members:oldMembers, member:member});
    }
    catch(err){
        res.send(err.message)
    }
}

// adding members to the group
const addMembers= async (req,res)=>{
    try{
        
       
        if( req.body.members.length > parseInt(req.body.limit)){
             res.send({success: false, msg:"More than limit members"})
        }
        else{
                const groupId= req.body.group_id;
                const members= req.body.members;
                if(members.length !== 24){
                    const memberArray= await members.map((member)=>{
                        return member;
                    });
    
                   
                    const newmembers= await Group.findByIdAndUpdate(groupId,{
                        $push:{
                            members_id:memberArray
                        }
                    },{new:true});
                  res.send({success:true, msg:"Member added successfully"})
                    
                }
                else{
                    const newmembers= await Group.findByIdAndUpdate(groupId,{
                        $push:{
                            members_id:members
                        }
                    },{new:true});
                  res.send({success:true, msg:"Member added successfully"})
                }
        }
        }
        catch(err){
            res.send({success:false, msg:err.message})
        }
}


    const deletegroup= async(req,res)=>{
        const id= req.params.id;
        const group= await Group.findById({_id:req.params.id});
        const user= await req.session.user;
        if(group.creator_id == user._id){
            await Group.findByIdAndDelete(id);
            res.redirect('/groups');
        }
        else{
           return res.redirect('/groups')
        }

    }

    const groupChat= async (req,res)=>{
        const user= req.session.user;
        const id= req.params.id;
        const groupName= await Group.findById(id);
        res.render('groupchat',{user:user,groupName:groupName,id:id});
    }

    const savegroupChat= async(req,res)=>{
        const {sender_id, group_id, message}= req.body;
        const groupChat= new GroupChat({
        sender_id:sender_id,
        group_id:group_id,
        message:message
        });
         const newgroupChat= await groupChat.save();
    res.send({success:true , data:newgroupChat});
    }

    const loadGroupChat= async (req,res)=>{
        try{
            const groupChat= await GroupChat.find({group_id:req.body.group_id});

        res.send({success:true, data:groupChat})
        }
        catch(err){
            res.send({success:false, msg:"No Message Found"})
        }
    }

module.exports= {
    getDash,
    register,
    createAccount,
    login,
    getDashboard,
    signIn,
    Logout,
    saveChat,
    deleteChat,
    updateChat,
    loadGroup,
    createNewChat,
    getMembers,
    addMembers,
    deletegroup,
    groupChat,
    savegroupChat,
    loadGroupChat
    
}