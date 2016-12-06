/**
 * Created by smk on 2016/12/6.
 * 权限管理路由
 */
var express=require('express');
var router=express.Router();

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//用户组页面
router.get('/authority/usergroup/index',function(req,res){
    res.render('authority/usergroup/index');
});
//用户页面
router.get('/authority/user/index',function(req,res){
    res.render('authority/user/index');
});

module.exports=router;