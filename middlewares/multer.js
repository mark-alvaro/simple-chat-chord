const multer=require('multer');

const uuidv4=require('uuid')
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null, uuidv4.v4() + file.originalname)
    }
});

module.exports=multer({storage:storage});
