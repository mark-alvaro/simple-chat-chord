const isLogin= async (req,res,next)=>{
    try{
        if(req.session.user){
            next()
         }
        else{
            res.redirect('/login')
        }
    }
    catch(err){
        console.log(err.message)
    }
}

const isLogout= async (req,res,next)=>{
    try{
        if(req.session.user){
            res.redirect('/dashboard')
        }
       next();
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports={
    isLogin, isLogout
}