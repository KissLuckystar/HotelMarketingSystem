var express = require('express');
var router = express.Router();

var crypto=require('crypto');//用于加密
var mongoose=require('mongoose');

var User=mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('login');
});

router.get('/login',checkNotLogin);
router.get('/login',function(req,res){
    console.log(req.session.user);
   res.render('index',{
       user:req.session.user,
       success:req.flash('success').toString(),
       error:req.flash('error').toString()
   });
});

router.post('/login',checkNotLogin);
router.post('/login',function(req,res){
   User.findOne({'userId':req.body.userId},function(err,person){
      if(err){
          res.end('login failed');
      }
      if(!person){
          req.flash('error','用户不存在');
          return res.redirect('/login');
      }
       //生成密码的md5值
       var md5 = crypto.createHash('md5');
       var password = md5.update(req.body.userPassword).digest('hex');
       if (person.userPassword != password) {
           req.flash('error', '密码错误');
           return res.redirect('/login');
       }

       //用户名和密码都匹配后，将用户信息存入session
       req.session.user = person;
       console.log(person.userId+'登陆成功');
       req.flash('success', '登陆成功');
       res.redirect('/index');
   });
});

router.get('/index',checkLogin);
router.get('/index',function(req,res,next){
    res.render('index',{
        user:req.session.user.userName
    });
});

//检测是否登陆，增加页面权限控制
function checkLogin(req,res,next){
  if(!req.session.user){
    req.flash('error',"未登录，请先登录");
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录');
    return res.redirect('back');//返回之前的页面
  }
  next();
}

module.exports = router;
