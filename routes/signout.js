/**
 * Created by smk on 2016/12/6.
 * 退出系统路由
 */
var express=require('express');
var router=express.Router();

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//退出系统
router.get('/',checkLogin,function(req,res,next){
    req.session.user=null;
    req.flash('success','安全退出');
    res.redirect('/signin');
});

module.exports=router;