/**
 * Created by smk on 2017/4/25.
 * 存放公共的路由
 */
var express=require('express');
var router=express.Router();

var mongoose=require('mongoose');
var async = require('async');
var Hotel=mongoose.model('Hotel');
var UserGroup=mongoose.model('UserGroup');
var Group=mongoose.model('Group');
var User=mongoose.model('User');
var Protocol=mongoose.model('Protocol');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated

var checkLogin=require('../middlewares/checkLogin').checkLogin;

//查询酒店、班组、用户组，生成combobox选项
router.get('/user/combobox',checkLogin,function(req,res,next){
    var queryParams = {};
    async.parallel({
        hotels: function (done) {  // 查询酒店
            Hotel.find(queryParams).exec(function (err, doc) {
                done(err, doc);
            });
        },
        groups: function (done) {   // 查询班组
            Group.find(queryParams).exec(function (err, doc) {
                done(err, doc);
            });
        },
        usergroups: function (done) {   // 查询用户组
            UserGroup.find(queryParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        res.json(results);
    });
});

//查询酒店员工列表，查询所有
router.get('/user/all',checkLogin,function(req,res,next){
    User.find({},function(err,users){
        if(err){
            console.log(err);
            return;
        }
        if(!users){
            console.log('酒店列表为空');
            return;
        }
        res.json(users);
    });
});

//查询协议列表，查询所有
router.get('/protocol/all',checkLogin,function(req,res,next){
    Protocol.find({},function(err,protocols){
        if(err){
            console.log(err);
            return;
        }
        if(!protocols){
            console.log('酒店列表为空');
            return;
        }
        res.json(protocols);
    });
});

module.exports=router;