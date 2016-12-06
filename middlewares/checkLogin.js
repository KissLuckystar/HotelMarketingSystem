/**
 * Created by smk on 2016/12/6.
 * ¼ì²âÓÃ»§ÊÇ·ñµÇÂ¼
 */
var session=require('express-session');

module.exports={
    checkLogin:function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('error','Î´µÇÂ¼');
            return res.redirect('/signin'); //·µ»Øµ½µÇÂ¼Ò³
        }
        next();
    },
    checkNotLogin:function checkNotLogin(req,res,next){
        if(req.session.user){
            console.log('2');
            req.flash('error','ÒÑµÇÂ¼');
            return res.redirect('/mainIndex'); //·µ»Øµ½Ê×Ò³
        }
        next();
    }
};