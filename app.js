var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');//引入session模块
var MongoStore=require('connect-mongo')(session);
var flash=require('connect-flash');//flash模块用来实现页面通知的功能（即成功与错误信息的提示）
var config=require('config-lite');
var mongoose=require('./config/mongoose.js');//4.引入数据库配置文件

var db=mongoose();
var routes=require('./routes');
//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//在终端显示简单的不同颜色的日志
app.use(bodyParser.json());//解析body中的json格式数据
//app.use(bodyParser.urlencoded({
//    type: function(req) {
//        return /x-www-form-urlencoded/.test(req.headers['content-type']);
//    },
//    extended: false
//}));
app.use(cookieParser());//处理cookie
app.use(express.static(path.join(__dirname, 'public')));//设置根目录的public文件夹为静态文件夹服务器

//session中间件
app.use(session({
    name:config.session.key,
    secret: config.session.secret,
    cookie: config.session.maxAge,
    store:new MongoStore({
        url:config.mongodb
    }),
    resave: true,//每次请求都重新设置session cookie,假如10分钟过期，则会再次设置10分钟
    saveUninitialized: false   //是指无论有没有session cookie,每次请求都重新设置个session cookie
}));

app.use(flash());

//处理表单和文件上传的中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/uploadImages'),//上传文件目录
    keepExtensions:true//保留后缀
}));

//设置模版全局变量
app.locals.hotel={
    name:'酒店电子预售券营销后台管理系统',
    description:'HotelMarketingSystem'
};
//添加变量
app.use(function(req,res,next){
    res.locals.user=req.session.user;
    res.locals.success=req.flash('success').toString();
    res.locals.error=req.flash('error').toString();
    next();
});

//路由
routes(app);
//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
