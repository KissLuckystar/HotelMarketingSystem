/**
 * Created by smk on 2016/12/6.
 * 登录模块路由
 */
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var crypto=require('crypto');//加密解密

var User=mongoose.model('User');
mongoose.Promise=global.Promise;

var checkNotLogin=require('../middlewares/checkLogin').checkNotLogin;

//用户登录页
router.get('/',checkNotLogin,function(req,res,next){
    console.log('3');
    res.render('signin');
});

//用户登录
router.post('/',checkNotLogin,function(req,res,next){
    var userId=req.fields.userId;
    var password=req.fields.userPassword;
    User.findOne({'userId':userId},function(err,user){
        if(err){
            res.end('login failed');
        }
        if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/signin');
        }
        //生成密码的md5值
        var md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
        if (user.userPassword != password) {
            req.flash('error', '密码错误');
            return res.redirect('/signin');
        }

        //用户名和密码都匹配后，将用户信息存入session
        req.session.user = user;
        console.log(user.userId+'登陆成功');
        req.flash('success', '登陆成功');
        res.redirect('/mainIndex');
    });
});

module.exports=router;