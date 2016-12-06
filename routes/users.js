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

/* 配置管理界面路由 */
router.get('/collocation/hotel/index',function(req,res){
   res.render('collocation/hotel/index.ejs');
});
router.get('/collocation/group/index',function(req,res){
    res.render('collocation/group/index.ejs');
});
router.get('/collocation/protocol/index',function(req,res){
    res.render('collocation/protocol/index.ejs');
});
router.get('/collocation/equipment/index',function(req,res){
    res.render('collocation/equipment/index.ejs');
});
/* 权限管理路由 */

/* 产品管理路由 */
router.get('/produce/customization/index',function(req,res){
    res.render('produce/customization/index.ejs');
});
router.get('/produce/verify/index',function(req,res){
    res.render('users/produce/verify/index.ejs');
});
router.get('/produce/maintain/index',function(req,res){
    res.render('produce/maintain/index.ejs');
});
/* 收银台 */
router.get('/cashierdesk/cashier/index',function(req,res){
    res.render('cashierdesk/cashier/index.ejs');
});
router.get('/cashierdesk/recharge/index',function(req,res){
    res.render('cashierdesk/recharge/index.ejs');
});
router.get('/cashierdesk/cashier/index',function(req,res){
    res,render('cashierdesk/cashier/index.ejs');
});
router.get('/cashierdesk/cashiercheck/index',function(req,res){
    res,render('cashierdesk/cashiercheck/index.ejs');
});
/* 销售统计 */
router.get('',function(req,res){});
router.get('',function(req,res){});
router.get('',function(req,res){});
router.get('',function(req,res){});
router.get('',function(req,res){});
router.get('',function(req,res){});
/* 账户账单 */
router.get('/accountbill/account/index',function(req,res){
    res.render('accountbill/account/index.ejs');
});
router.get('/accountbill/bill/index',function(req,res){
    res.render('accountbill/bill/index.ejs');
});
/* 营销信息 */
router.get('/marketinginfo/marketingpic/index',function(req,res){
    res.render('marketinginfo/marketingpic/index.ejs');
});
router.get('/marketinginfo/marketingactive/index',function(req,res){
    res.render('marketinginfo/marketingactive/index.ejs');
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
