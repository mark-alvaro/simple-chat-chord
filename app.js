const express= require('express');
const mongoose= require('mongoose');
require('dotenv').config();
const app= require('express')();
const userRoute= require('./routes/user.route');

const path= require('path');
// static Files

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static( path.join(__dirname, 'uploads')))

mongoose.connect('mongodb+srv://mark:aaaaa@cluster0.8hpi9si.mongodb.net/?retryWrites=true&w=majority');

const bodyParser= require('body-parser');
const session= require('express-session')
// cookie Parser
const cookieParser= require('cookie-parser')
const {SESSION_SECRET}= process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// socket io Configuration
const socketio=require('socket.io')
const http= require('http')
const server=http.createServer(app);
const io=socketio(server);
const User= require('./models/user.model');
const Chat= require('./models/chat.model')

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(session({
    secret:SESSION_SECRET|| 'ifitfeelslikehome',
    resave:false,
    saveUninitialized:false,
})); 
app.use(cookieParser());
app.use('/', userRoute)

// socket
const usp= io.of('/user-namespace');
usp.on('connection',async (socket)=>{
    console.log('User connected Successfully');
    var userId= socket.handshake.auth.token;
    await User.findByIdAndUpdate({_id:userId}, {$set:{is_online:"1"}});
    //user online for all user to show
    socket.broadcast.emit('online',{user_id:userId});
        socket.on('disconnect',async ()=>{
        console.log('User disconnect!')
        var userId= socket.handshake.auth.token;
        await User.findByIdAndUpdate({_id:userId}, {$set:{is_online:"0"}});
    // user offline for all user to show
        socket.broadcast.emit('offline',{user_id:userId});

    });
    // chatting Implement
    socket.on('newChat', ({data,reciver})=>{
        socket.broadcast.emit('loadNewChat', {data,reciver})
    });

    //loading Old Chat data
    socket.on('exitChat',async (data)=>{
        let senderUser= await User.findById({ _id:data.sender_id});
        let reciveUser= await User.findById({_id:data.reciver_id})
       let chats= await Chat.find({
            $or:[
                {sender_id:data.sender_id, reciver_id:data.reciver_id},
                {sender_id:data.reciver_id, reciver_id:data.sender_id}
            ]
        });
        socket.emit('loadChats',{chats:chats,senderUser:senderUser,reciveUser:reciveUser})
    })

    //deleted Chat
    socket.on('chatDeleted', function(id){
        socket.broadcast.emit('ChatMessageDeleted', id)
    })

    // updated Chat
    socket.on('chatUpdated',function(data){
        socket.broadcast.emit('ChatMessageUpdated', data);
    })
    // new group Chat
    socket.on('newGroupChat', (function(data){
        socket.broadcast.emit('loadNewGroupChat', data); 
    }))
})



server.listen(5000,()=>{
    console.log("Server is running");
})