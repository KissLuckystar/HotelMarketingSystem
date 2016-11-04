var express = require('express');
var router = express.Router();
var crypto=require('crypto');//用于加密
var mongoose=require('mongoose');
var User=mongoose.model('User');
mongoose.Promise =global.Promise;//解决（mongoose's default promise library) is deprecated


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/addUser',function(req,res,next){

    //密码使用md5加密
    var md5 = crypto.createHash('md5');

    var user=new User({
        userId:1,
        userName:'S',
        userPassword:md5.update('123456').digest('hex'),
        userSex:'男',
        userPhone:'15994272193',
        userEmail:'2685331701@qq.com',
        userIdentity:'管理员',//用户身份，主要包括管理员，收银员
        userHotelCode:'0',//0代表总店，1代表分店一，2代表分店二
        userClassCode:'00',//班组表,由所属酒店和组号组成
        userStatus:'正常',
        userAuthority:'1,2',
        createTime:Date.now(),
        lastLogin:Date.now()
    });

    User.findOne({'userId':user.userId},function(err,doc){
        if(err){
            res.end('Search Error');
            return next();//转向下一个路由
        }
        if(doc){
            res.setHeader('content-type','text/html; charset=UTF-8');//响应编码，如果是html,写在head中也可以
            res.end('用户ID已存在');
        }else{
            //将用户注册数据存入数据库
            user.save(function(err){
                if(err){
                    res.end('Save Error');
                    return next();
                }
                User.find({},function(err,docs){
                    if(err){
                        res.end("Search Error");
                        return next();
                    }
                    res.json(docs);
                });
            });
        }
    });
})


module.exports = router;
