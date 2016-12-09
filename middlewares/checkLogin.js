/**
 * Created by smk on 2016/12/6.
 */
var session=require('express-session');

module.exports={
    checkLogin:function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('error','未登录');
            return res.redirect('/signin'); //返回登录页
        }
        next();
    },
    checkNotLogin:function checkNotLogin(req,res,next){
        if(req.session.user){
            console.log('2');
            req.flash('error','已登录');
            return res.redirect('/mainIndex'); //返回首页
        }
        next();
    }
};