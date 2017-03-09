/**
 * Created by smk on 2017/3/8.
 * 账户账单路由类
 */
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var crypto=require('crypto');//加密解密

var AppUser=mongoose.model('AppUser');
mongoose.Promise=global.Promise;

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//APP用户管理页面
router.get('/appuser',function(req,res,next){
    AppUser.find({},function(err,users){
        if(err){
            console.log('find device err',err);
        }
        if(!users){
            //throw new Error('列表为空');
            console.log('列表为空');
        }
        res.json(users);
    })
});

//app用户登录
router.post('/appuserlogin',function(req,res,next){
    var appUserAccount=req.fields.appUserAccount;
    var password=req.fields.password;

    AppUser.findOne({'appUserAccount':appUserAccount},function(err,user){
        if(err){
            res.send(JSON.stringify({'error':'服务器错误，请稍后再试'}));
        }
        if(!user){
            console.log('用户不存在');
            res.send(JSON.stringify({'error':'账户不存在，请注册'}));
        } else {
            //生成密码的md5值
            //var md5 = crypto.createHash('md5');
            //password = md5.update(password).digest('hex');
            //console.log(password);
            if (user.password == password) {
                res.send(JSON.stringify({'success':'正在登录'}));
            }else{
                res.send(JSON.stringify({'error':'密码错误，请核对后输入'}));
            }
        }


    });
});

module.exports=router;


