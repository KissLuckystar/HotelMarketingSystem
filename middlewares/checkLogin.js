/**
 * Created by smk on 2016/12/6.
 * ����û��Ƿ��¼
 */
var session=require('express-session');

module.exports={
    checkLogin:function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('error','δ��¼');
            return res.redirect('/signin'); //���ص���¼ҳ
        }
        next();
    },
    checkNotLogin:function checkNotLogin(req,res,next){
        if(req.session.user){
            console.log('2');
            req.flash('error','�ѵ�¼');
            return res.redirect('/mainIndex'); //���ص���ҳ
        }
        next();
    }
};