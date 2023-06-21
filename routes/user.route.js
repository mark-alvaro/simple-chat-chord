const express= require('express');
const router= express.Router();
const userController= require('../controllers/user.controller')
const auth= require('../middlewares/auth')
router.get('/', userController.getDash)
router.get('/register',auth.isLogout, userController.register);
router.post('/register', userController.createAccount);

router.get('/login',  auth.isLogout,userController.login);
router.post('/login', userController.signIn)
router.get('/logout',  auth.isLogin,userController.Logout)
router.get('/dashboard', auth.isLogin, userController.getDashboard)
//for message 
router.post('/save-message', userController.saveChat);
router.post('/delete-message', userController.deleteChat);
router.post('/update-message', userController.updateChat);
// grouping
router.get('/groups', auth.isLogin, userController.loadGroup)
router.post('/groups',auth.isLogin, userController.createNewChat)
// add Members and getMember to group
router.post('/get-members', auth.isLogin, userController.getMembers)
router.post('/add-members', auth.isLogin, userController.addMembers)
router.get('/delete-group/:id', auth.isLogin, userController.deletegroup)
// gorupchat
router.get('/group-chat/:id', auth.isLogin, userController.groupChat)
router.post('/save-group-chat', auth.isLogin, userController.savegroupChat)
router.post('/load-group-chat', auth.isLogin, userController.loadGroupChat)
module.exports= router;