/**
 * Created by smk on 2016/12/6.
 * 配置管理路由
 */
var express=require('express');
var router=express.Router();

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//酒店管理
router.get('/hotel',function(req,res,next){
    res.render('collocation/hotel/index');
});
//班组管理
router.get('/group',function(req,res,next){
    res.render('collocation/group/index');
});
//协议管理
router.get('/protocol',function(req,res,next){
    res.render('collocation/protocol/index');
});
//设备管理
router.get('/equipment',function(req,res,next){
    res.render('collocation/equipment/index');
});







module.exports=router;
