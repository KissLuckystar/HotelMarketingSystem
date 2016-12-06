/**
 * Created by smk on 2016/12/6.
 * 首页路由
 */
var express=require('express');
var router=express.Router();

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//系统首页
router.get('/',checkLogin,function(req,res,next){
    res.render('index');
});

module.exports=router;